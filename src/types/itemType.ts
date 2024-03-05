import {
  MenuItemGroupType,
  SubMenuType,
} from 'ant-design-vue/es/menu/src/hooks/useItems';
import {
  MenuDividerType,
} from 'ant-design-vue/es/menu/src/interface';

import MenuDashboardItemType from '@/interfaces/modules/dashboard/menuItemType';

export type ItemType = MenuDashboardItemType
  | SubMenuType
  | MenuItemGroupType
  | MenuDividerType
  | null;
