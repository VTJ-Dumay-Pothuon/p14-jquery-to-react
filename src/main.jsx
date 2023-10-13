import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'

import store from './store'

import App from './components/App.jsx'
import Employees from './components/Employees.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route exact path="/" element={<App />} />
        <Route exact path="/employee-list" element={<Employees />} />
      </Routes>
    </Router>
  </Provider>
)