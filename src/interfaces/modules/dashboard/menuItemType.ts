import {
  MenuItemType,
} from 'ant-design-vue/es/menu/src/hooks/useItems';

export default interface MenuDashboardItemType extends MenuItemType {
  visible: boolean,
  path: string,
}
