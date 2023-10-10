# ABS - Angular Bootstrap Sidebar
The **Angular Bootstrap Sidebar** is a powerful and flexible sidebar menu component for Angular applications.
It enables you to create responsive and interactive sidebar menus with ease.
### Features
- Create customizable sidebar menus.
- Supports nested menu items.
- Dynamic menu item highlighting based on the current route.
- Smooth menu toggling and hover interactions.
- Easily integrate it into your Angular applications.
### Installation
You can install the angular-bootstrap-sidebar package via npm:
```console
npm install angular-bootstrap-sidebar
```
**__Bootstrap 5.1.3 and Font Awesome 4.7.0 are must required__**

### Usage
> 1. Import the **AngularBootstrapSidebar** in your Angular module:
```typescript
import { AngularBootstrapSidebar } from 'angular-bootstrap-sidebar';

@NgModule({
  declarations: [/* Your components */],
  imports: [AngularBootstrapSidebar, /* Other modules */],
})
export class YourModule { }
```
> 2. Use the **<abs>** component in your HTML template:
```html
<abs [menuData]="menu" [menuActive]="true" [menuHover]="true"></abs>
```
> 3. Define your menu data in your component:
```typescript
menu = [
  {
    label: "Dashboard",
    icon: "fa-x-dial-box",
    link: "/admin/dashboard",
    subItems: [
      { label: "Live Statistic on Map", link: "/admin/dashboard/live-statistic-map" },
      { label: "CM Dashboard", link: "/admin/dashboard/cm-dashboard" }
    ]
  }
];
```
#### Inputs
- **`menuData`**: An array of menu items to be displayed in the sidebar.
#### Options
- **`menuActive`**: Controls whether the menu is initially open or closed.
- **`menuHover`**: Determines if menu items respond to hover interactions.

##### Shortcuts to toggle menu
> [Ctrl+Shift+S]
(npm)[https://www.npmjs.com/package/angular-bootstrap-sidebar]
