import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'

import store from './store'

import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route exact path="/" element={<App />} />
        {/*<Route path="/employee-list" component={App} />*/}
      </Routes>
    </Router>
  </Provider>
)