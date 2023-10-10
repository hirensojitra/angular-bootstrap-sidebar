import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'abs';
  public menu = [{
    "label": "Dashboard",
    "icon": "fa-gear",
    "link": "",
    "subItems": [{
      "label": "Live Statistic on Map",
      "link": ""
    },
    {
      "label": "CM Dashboard",
      "link": "/admin/dashboard/cm-dashboard"
    },
    {
      "label": "RMS Dashboard",
      "link": "/admin/dashboard/rms-dashboard"
    },
    {
      "label": "Alert Dashboard",
      "link": "/admin/dashboard/alert-dashboard"
    },
    {
      "label": "Cost Saving Dashboard",
      "link": "/admin/dashboard/cost-saving-dashboard"
    },
    {
      "label": "Enviromental Dashboard",
      "link": "/admin/dashboard/enviromental-dashboard"
    }]
  },
  {
    "label": "Alert Management",
    "icon": "fa-asterisk",
    "link": "/admin/alert-management",
    "subItems": [{
      "label": "Fault Time Color Setup",
      "link": "/admin/alert-management/fault-time-color-setup"
    },
    {
      "label": "Alert Configuration",
      "link": "/admin/alert-management/alert-configuration"
    },
    {
      "label": "Alert Handling Dashboard",
      "link": "/admin/alert-management/alert-handling-dashboard"
    }]
  },
  {
    "label": "Asset Management",
    "icon": "fa-bookmark",
    "link": "/admin/asset-management",
    "subItems": [{
      "label": "List of Assets",
      "link": "/admin/asset-management/list-of-assets"
    }]
  },
  {
    "label": "User Management",
    "icon": "fa-users",
    "link": "/admin/user-management",
    "subItems": [{
      "label": "Add User",
      "link": "/admin/user-management/add-user"
    },
    {
      "label": "Add User Role",
      "link": "/admin/user-management/add-user-role"
    },
    {
      "label": "Urer Role Assignment",
      "link": "/admin/user-management/user-role-assignment"
    }]
  },
  {
    "label": "GRMS",
    "icon": "fa-pie-chart",
    "link": "/admin/grms",
    "subItems": [{
      "label": "Grievance Configuration",
      "link": "/admin/grms/grievance-configuration",
      "subItems": [{
        "label": "Category Master",
        "link": "/admin/grms/grievance-configuration/grievance-category-master"
      },
      {
        "label": "Sub Category Master",
        "link": "/admin/grms/grievance-configuration/grievance-sub-category-master"
      },
      {
        "label": "Sub Category User Role Mapping",
        "link": "/admin/grms/grievance-configuration/grievance-sub-category-user-role-mapping"
      }]
    },
    {
      "label": "Grievance Information",
      "link": "/admin/grms/grievance-information",
      "subItems": [{
        "label": "Raise Ticket",
        "link": "/admin/grms/grievance-information/grievance-raise-ticket"
      },
      {
        "label": "Ticket List",
        "link": "/admin/grms/grievance-information/grievance-ticket-list"
      }]
    },
    {
      "label": "Grievance Reports",
      "link": "/admin/grms/grievance-reports",
      "subItems": [{
        "label": "Summary Report",
        "link": "/admin/grms/grievance-reports/grievance-summary-report"
      },
      {
        "label": "Detail Report",
        "link": "/admin/grms/grievance-reports/grievance-detail-report"
      }]
    }]
  },
  {
    "label": "Help Desk Module",
    "icon": "fa-user",
    "link": "/admin/help-desk-module"
  }];
}
