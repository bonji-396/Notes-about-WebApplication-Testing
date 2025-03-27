# React + Testing-library + Jest

## UIコンポーネントテストの基本

#### Button.tsx

```tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;
```

#### Button.test.tsx

```tsx
import { render, screen } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('buttonタグがレンダリングされる', () => {
    render(<Button label='ボタン' onClick={() => alert('click')} />);

    const element = screen.getByRole('button');
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('ボタン');
  });
});
```

#### 実行結果
```sh
% npm test

> ui-test-lesson@0.0.0 test
> jest

 PASS  src/components/Button.test.tsx
  Button
    ✓ buttonタグがレンダリングされる (29 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.698 s, estimated 1 s
Ran all test suites.
```

## ユーザーイベントのUIコンポーネントテスト

#### Form.tsx
```tsx
import { FormEvent, useState } from "react";

const Form = () => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    alert(`submitted: ${inputValue}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter text"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Form;
```

#### Form.test.ts
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Form from './Form';

const user = userEvent.setup();

describe('Form', () => {
  it('初期状態ではテキストは空白であること', () => {
    render(<Form />);

    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveTextContent('');
  });

  it('入力したテキストがサブミットされること', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockReturnValue();
    render(<Form />);

    const input = screen.getByPlaceholderText('Enter text');
    await user.type(input, 'Test text');
    expect(screen.getByDisplayValue('Test text')).toBeInTheDocument();

    const button = screen.getByRole('button');
    await user.click(button);
    expect(alertSpy).toHaveBeenCalledWith('submitted: Test text');
    alertSpy.mockRestore();
  });
});

```

#### 実行結果
```sh
% npm test ./src/components/Form.test.tsx

> ui-test-lesson@0.0.0 test
> jest ./src/components/Form.test.tsx

 PASS  src/components/Form.test.tsx
  Form
    ✓ 初期状態ではテキストは空白 (16 ms)
    ✓ 入力したテキストがサブミットされる。 (75 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        0.557 s, estimated 1 s
Ran all test suites matching /.\/src\/components\/Form.test.tsx/i.
```

## 非同期UIコンポーネントののテスト


#### AsyncComponent.tsx
```tsx
import { useState } from "react";

const AsyncComponent: React.FC = () => {
  const [text, setText] = useState("Initial text");

  const updateText = async () => {
    setText("Loading...");
    setTimeout(() => {
      setText("Updated text");
    }, 2000);
  };

  return (
    <div>
      <button onClick={updateText}>Update Text</button>
      <p>{text}</p>
    </div>
  );
};

export default AsyncComponent;
```

#### AsyncComponent.test.tsx
```tsx
import { render, screen, waitFor } from '@testing-library/react';
import AsyncComponent from './AsyncComponent';
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();

describe('AsyncComponent', () => {
  it('ボタンをクリックすると、非同期処理が実行されること', async () => {
    render(<AsyncComponent />);
    expect(screen.getByText('Initial text')).toBeInTheDocument();

    const button = screen.getByRole('button');
    await user.click(button);
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.getByText('Updated text')).toBeInTheDocument();
      },
      {
        interval: 50,
        timeout: 3000,
      }
    );
  });
});
```

#### 実行結果
```sh
% npm test ./src/components/AsyncComponent.test.tsx

> ui-test-lesson@0.0.0 test
> jest ./src/components/AsyncComponent.test.tsx

 PASS  src/components/AsyncComponent.test.tsx
  AsyncComponent
    ✓ ボタンをクリックすると、非同期処理が実行されること (2053 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        2.549 s
Ran all test suites matching /.\/src\/components\/AsyncComponent.test.tsx/i.
```

## フックのテスト

#### useCounter.tsx
```tsx
import { useState } from "react";

const useCounter = (initialValue: number) => {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount((prevCount) => prevCount + 1);
  const decrement = () => setCount((prevCount) => prevCount - 1);

  return { count, increment, decrement };
};

export default useCounter;
```

#### useCounter..test.tsx
```tsx
import { act, renderHook } from '@testing-library/react';
import useCounter from './useCounter';

describe('useCounter', () => {
  it('increment', () => {
    const { result } = renderHook(() => useCounter(1));
    expect(result.current.count).toBe(1);

    act(() => result.current.increment());
    expect(result.current.count).toBe(2);

    act(() => result.current.decrement());
    expect(result.current.count).toBe(1);
  });
});

```

#### 実行結果
```sh
 % npm test ./src/hooks/useCounter.test.tsx

> ui-test-lesson@0.0.0 test
> jest ./src/hooks/useCounter.test.tsx

 PASS  src/hooks/useCounter.test.tsx
  useCounter
    ✓ increment (8 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.484 s, estimated 1 s
Ran all test suites matching /.\/src\/hooks\/useCounter.test.tsx/i.
```

## スナップショットテスト

#### SnapshotComponent.tsx
```tsx
type Props = {
  text: string;
};

const SnapshotComponent: React.FC<Props> = ({ text }) => {
  return (
    <div>
      <p>{text}</p>
    </div>
  );
};

export default SnapshotComponent;
```
#### SnapshotComponent.test.tsx（１回目）
```tsx
import { render } from '@testing-library/react';
import SnapshotComponent from './SnapshotComponent';

describe('SnapshotComponent', () => {
  it('スナップショットテスト', () => {
    const { container } = render(<SnapshotComponent text='React' />);
    expect(container).toMatchSnapshot();
  });
});
```

#### １回目実行結果
```sh
% npm test ./src/components/SnapshotComponent.test.tsx

> ui-test-lesson@0.0.0 test
> jest ./src/components/SnapshotComponent.test.tsx

 PASS  src/components/SnapshotComponent.test.tsx
  SnapshotComponent
    ✓ スナップショットテスト (10 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   1 passed, 1 total
Time:        0.455 s, estimated 1 s
Ran all test suites matching /.\/src\/components\/SnapshotComponent.test.tsx/i.
```

#### SnapshotComponent.test.tsx（２回目）
```tsx
import { render } from '@testing-library/react';
import SnapshotComponent from './SnapshotComponent';

describe('SnapshotComponent', () => {
  it('スナップショットテスト', () => {
    const { container } = render(<SnapshotComponent text='Vue' />);
    expect(container).toMatchSnapshot();
  });
});
```

#### ２回目実行結果
```sh
% npm test ./src/components/SnapshotComponent.test.tsx

> ui-test-lesson@0.0.0 test
> jest ./src/components/SnapshotComponent.test.tsx

 FAIL  src/components/SnapshotComponent.test.tsx
  SnapshotComponent
    ✕ スナップショットテスト (10 ms)

  ● SnapshotComponent › スナップショットテスト

    expect(received).toMatchSnapshot()

    Snapshot name: `SnapshotComponent スナップショットテスト 1`

    - Snapshot  - 1
    + Received  + 1

      <div>
        <div>
          <p>
    -       React
    +       Vue
          </p>
        </div>
      </div>

       5 |   it('スナップショットテスト', () => {
       6 |     const { container } = render(<SnapshotComponent text='Vue' />);
    >  7 |     expect(container).toMatchSnapshot();
         |                       ^
       8 |   });
       9 | });
      10 |

      at Object.<anonymous> (src/components/SnapshotComponent.test.tsx:7:23)

 › 1 snapshot failed.
Snapshot Summary
 › 1 snapshot failed from 1 test suite. Inspect your code changes or run `npm test -- -u` to update them.

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   1 failed, 1 total
Time:        0.502 s, estimated 1 s
Ran all test suites matching /.\/src\/components\/SnapshotComponent.test.tsx/i.
```

#### スナップショットのアップデート

```ts
% npm test ./src/components/SnapshotComponent.test.tsx -- -u      

> ui-test-lesson@0.0.0 test
> jest ./src/components/SnapshotComponent.test.tsx -u

 PASS  src/components/SnapshotComponent.test.tsx
  SnapshotComponent
    ✓ スナップショットテスト (9 ms)

 › 1 snapshot updated.
Snapshot Summary
 › 1 snapshot updated from 1 test suite.

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   1 updated, 1 total
Time:        0.451 s, estimated 1 s
Ran all test suites matching /.\/src\/components\/SnapshotComponent.test.tsx/i.
```

## ユーザイベントと非同期の組み合わせ例
#### UserSearch.tsx
```tsx
import { useState } from "react";
import axios from "axios";

interface User {
  id: number;
  name: string;
}

export const UserSearch = () => {
  const [query, setQuery] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const search = async () => {
    const { data } = await axios.get<User>(`/api/users?query=${query}`);
    setUser(data);
  };

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <button onClick={search}>Search</button>
      {user && <div>{user.name}</div>}
    </div>
  );
};
```

#### UserSearch.test.tsx
```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserSearch } from './UserSearch';
import axios from 'axios';

jest.mock('axios');
const mockAxios = jest.mocked(axios);

describe('UserSearch', () => {
  beforeEach(() => {
    mockAxios.get.mockReset();
  });

  const user = userEvent;
  test('textboxの初期値は空白であること', () => {
    render(<UserSearch />);
    // screen.debug();
    const input = screen.getByRole('textbox');
    expect(input).toBeTruthy();
    expect(input).toBeInTheDocument();
    expect(input).toHaveTextContent('');
    expect(screen.getByDisplayValue('')).toBeTruthy();

    const button = screen.getByRole('button');
    expect(button).toBeTruthy();
  });

  test('検索ボタンが押下された時、入力フィールドに値が正しくリクエストされること', async () => {
    const userInfo = {
      id: 1,
      name: 'Taro',
    };
    const resp = { data: userInfo };
    mockAxios.get.mockResolvedValue(resp);

    render(<UserSearch />);

    const input = screen.getByRole('textbox');
    await user.type(input, userInfo.name);
    expect(screen.getByDisplayValue(userInfo.name)).toBeTruthy();
    // screen.debug();

    const button = screen.getByRole('button');
    await user.click(button);
    expect(mockAxios.get).toHaveBeenCalledWith(
      `/api/users?query=${userInfo.name}`
    );
    await waitFor(() =>
      expect(screen.getByText(userInfo.name)).toBeInTheDocument()
    );
    // screen.debug();
  });
});

```
#### 処理結果 
```sh
% npm test ./src/components/UserSearch.test.tsx

> ui-test-lesson@0.0.0 test
> jest ./src/components/UserSearch.test.tsx

 PASS  src/components/UserSearch.test.tsx
  UserSearch
    ✓ textboxの初期値は空白であること (35 ms)
    ✓ 検索ボタンが押下された時、入力フィールドに値が正しくリクエストされること (52 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        0.621 s, estimated 1 s
Ran all test suites matching /.\/src\/components\/UserSearch.test.tsx/i.
```