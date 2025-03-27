import { ShoppingList } from "./practice";

describe('ShoppingListテスト', () => {
  let shoppingList: ShoppingList;

  beforeEach(() => {
    shoppingList = new ShoppingList()
  })

  describe('addItem', () => {
    test('アイテムをリストに追加できること', () => {
      shoppingList.addItem('hoge');
      expect(shoppingList.list.includes('hoge')).toBeTruthy();
      expect(shoppingList.list).toContain('hoge');
    })      
  });

  describe('removeItem', () => {
    beforeAll(() => {
      shoppingList.addItem('hoge');
      shoppingList.removeItem('hoge');
    })
    test('アイテムをリストから削除できること', () => {
      expect(shoppingList.list.includes('hoge')).toBeFalsy();
      expect(shoppingList.list).not.toContain('hoge');
    })
  
    test('存在しないアイテムの削除を試みたときにエラーをスローすること', () => {
      expect(() => shoppingList.removeItem('pika')).toThrow(Error);
      expect(() => shoppingList.removeItem('pika')).toThrow('アイテム: pika は存在しません');
    })
  });
});