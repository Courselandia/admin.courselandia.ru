import {
  MenuItemGroupType,
  MenuItemType, SubMenuType,
} from 'ant-design-vue/es/menu/src/hooks/useItems';
import { MenuDividerType } from 'ant-design-vue/es/menu/src/interface';

export default interface MenuDashboardItemType extends MenuItemType {
  visible?: boolean,
  path?: string,
  children?: Array<MenuDashboardItemType
    | SubMenuType
    | MenuItemGroupType
    | MenuDividerType>,
}
