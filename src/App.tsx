// import './App.css'
import style from './style.module.scss'
import FetchDataExample from './Axios/DataExample'
import ListUser from './User/ListUser/ListUser'
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
