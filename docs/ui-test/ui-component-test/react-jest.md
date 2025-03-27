# UIコンポーネントテスト（React + TypeScript + Vite + Jest）
React + TypeScript + Vite 環境において、テストフレームワークとして Jest を使う構成で、以下のようにセットアップし直した上で、各テストパターンに対応するサンプルコードを記載。

## サンプルテスト対象の構築
React + TypeScript + Vite + Jest　セットアップを行います。

### 1. Vite プロジェクト作成

```sh
npm create vite@latest react-jest-sample --template react-ts
cd react-jest-sample
npm install
```

### 2. Jest 関連ライブラリインストール

```sh
npm install --save-dev jest @types/jest ts-jest ts-node @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
```
### 3. Jest 設定ファイル作成（jest.config.ts）

```ts
/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.app.json' }],
  },
  setupFilesAfterEnv: ['./jest.setup.ts'],
};
```

### 4. 初期化ファイル（jest.setup.ts）

```ts
import '@testing-library/jest-dom';
```

### 5. コンパイルオプションの追加（ts.config.app.json）
以下を追加
```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "types": ["@testing-library/jest-dom"]
  },
}
```

### 6. test コマンドの追加（package.json）
```json
  "scripts": {
    "dev": "vite",
    "test": "jest",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
```


## 基本的な利用

#### テスト対象（src/components/Counter.tsx）

```tsx
import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

#### テストコード（src/components/Counter.test.tsx）
```tsx
import { render, screen } from '@testing-library/react';
import { Counter } from './Counter';

test('renders initial count', () => {
  render(<Counter />);
  expect(screen.getByText('Count: 0')).toBeInTheDocument();
});
```

#### 実行結果
```sh
% npm test ./src/components/Counter.test.tsx 

> react-jest-sample@0.0.0 test
> jest ./src/components/Counter.test.tsx

 PASS  src/components/Counter.test.tsx
  ✓ renders initial count (15 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.595 s, estimated 1 s
Ran all test suites matching /.\/src\/components\/Counter.test.tsx/i.
```

## ユーザーイベントテスト


#### テストコード（src/components/Counter.test.tsx）
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';

// test('renders initial count', () => {
//   render(<Counter />);
//   expect(screen.getByText('Count: 0')).toBeInTheDocument();
// });

test('increments count on button click', async () => {
  render(<Counter />);
  const button = screen.getByRole('button', { name: 'Increment' });
  await userEvent.click(button);
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

#### 
```sh
% npm test ./src/components/Counter.test.ts

> react-jest-sample@0.0.0 test
> jest ./src/components/Counter.test.ts

 PASS  src/components/Counter.test.tsx
  ✓ increments count on button click (52 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.616 s, estimated 1 s
Ran all test suites matching /.\/src\/components\/Counter.test.ts/i.
```

## 非同期のUIテスト

#### src/components/AsyncMessage.tsx
```tsx
import { useEffect, useState } from 'react';

export function AsyncMessage() {
  const [message, setMessage] = useState('Loading...');
  useEffect(() => {
    const timeout = setTimeout(() => setMessage('Hello, async world!'), 500);
    return () => clearTimeout(timeout);
  }, []);
  return <p>{message}</p>;
}
```

#### src/components/AsyncMessage.test.tsx
```tsx
import { render, screen, waitFor } from '@testing-library/react';
import { AsyncMessage } from './AsyncMessage';

test('displays async message', async () => {
  render(<AsyncMessage />);
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  await waitFor(() => expect(screen.getByText('Hello, async world!')).toBeInTheDocument());
});

```
####
```sh
 % npm test ./src/components/AsyncMessage.test.tsx 

> react-jest-sample@0.0.0 test
> jest ./src/components/AsyncMessage.test.tsx

 PASS  src/components/AsyncMessage.test.tsx
  ✓ displays async message (514 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.873 s, estimated 1 s
Ran all test suites matching /.\/src\/components\/AsyncMessage.test.tsx/i.
```

## フックのテスト
#### src/hooks/useCounter.ts

```ts
import { useState } from 'react';

export function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  const increment = () => setCount((c) => c + 1);
  return { count, increment };
}
```

#### src/hooks/useCounter.test.ts

```ts
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

test('should increment counter', () => {
  const { result } = renderHook(() => useCounter());
  act(() => result.current.increment());
  expect(result.current.count).toBe(1);
});
```

#### 実行結果
```sh
 % npm test ./src/components/useCounter.test.ts

> react-jest-sample@0.0.0 test
> jest ./src/components/useCounter.test.ts

 PASS  src/components/useCounter.test.ts
  ✓ should increment counter (8 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.555 s
Ran all test suites matching /.\/src\/components\/useCounter.test.ts/i.
```

## スナップショットテスト

#### src/components/Counter.snapshot.test.tsx

```tsx
import { render } from '@testing-library/react';
import { Counter } from './Counter';

test('matches snapshot', () => {
  const { container } = render(<Counter />);
  expect(container).toMatchSnapshot();
});
```

#### 実行結果
```sh
% npm test ./src/components/Counter.snapshot.test.tsx

> react-jest-sample@0.0.0 test
> jest ./src/components/Counter.snapshot.test.tsx

 PASS  src/components/Counter.snapshot.test.tsx
  ✓ matches snapshot (11 ms)

 › 1 snapshot written.
Snapshot Summary
 › 1 snapshot written from 1 test suite.

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   1 written, 1 total
Time:        0.402 s, estimated 1 s
Ran all test suites matching /.\/src\/components\/Counter.snapshot.test.tsx/i.
```

#### Counter.snapshot.test.tsx.snap
実行時に __snapshots__ ディレクトリが作成され、次回以降差分がチェックされます。

```snap
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`matches snapshot 1`] = `
<div>
  <div>
    <p>
      Count: 
      0
    </p>
    <button>
      Increment
    </button>
  </div>
</div>
`;

```