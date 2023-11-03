# HRnet 2.0
## Introduction
The original HRnet app (that still can be found in '/legacy') was built with jQuery.
While it was a good choice at the time, it is now outdated and not very maintainable.

This is a new version of the app, built with Vite-React, and managed by React-Redux.

HRnet 1.0 had four jQuery plugins :
- [A modal displayer](https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.js)
- [A table sorter with pagination](https://cdn.datatables.net/1.10.21/js/jquery.dataTables.min.js)
- [A datetime picker](https://github.com/VTJ-Dumay-Pothuon/p14-jquery-to-react/blob/master/legacy/jquery.datetimepicker.full.min.js)
- [Dropdowns from jQuery UI](https://code.jquery.com/ui/1.12.1/jquery-ui.js)

HRnet 2.0 relies on React libraries instead :
- [React-Modal](https://www.npmjs.com/package/react-modal)
- [React-Table](https://www.npmjs.com/package/react-table)
- [@vtjdp/date-picker](https://www.npmjs.com/package/@vtjdp/date-picker)
and the dropdowns are just HTML5 selects with React event handlers and CSS styling.

@vtjdp/date-picker is a custom date picker homebuilt from scratch. You can find its source code in '/src/components/DatePicker', and a vanilla JS version in '/src/plugins/DatePicker'.

## Installation
### Prerequisites
- Node.js >=6.9.0
- npm

### Steps
1. Clone the repository
2. Run `npm install` in the project directory
3. Run `npm run dev` to start the development server
4. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## Usage
You can create a new employee from the homepage, and see the list of all employees in the 'Current employees' page. When creating a new employee, you can either close the popup
modal and create a new one, or press 'Enter', which will redirect you to the 'Current employees' page. It's just a shortcut.

No field is mandatory, but if you don't put a date of birth or a start date, the employee will be considered born on 01/01/1970 and/or hired today. Dates are mandatory for sorting and filtering purposes, while the other fields will just be treated as empty strings.

For testing purposes, I provided a list of 500 employees in '/src/assets/example.json'. You can import them manually :
1. Open the dev tools in your browser
2. Go to the 'Storage' tab
3. Select 'Local storage' in the left panel
4. Click on 'Add item' and enter 'employees' as the key
5. Copy the content of '/src/assets/example.json' and paste it as the value
6. Refresh the page

And voilà ! You now have 500 employees in your database. And as you refreshed the page,
they were copied in the Redux store, so you can see them in the 'Current employees' page.