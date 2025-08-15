// import './App.css'
import style from './style.module.scss'
import FetchDataExample from './utils/axios/DataExample'
import ListUser from './components/User/ListUser/ListUser'
function App() {


  return (
    <>
      <div className={style.new} >
        hello
      </div>
       <FetchDataExample></FetchDataExample>
       <ListUser></ListUser>
    </>
  )
}

export default App
