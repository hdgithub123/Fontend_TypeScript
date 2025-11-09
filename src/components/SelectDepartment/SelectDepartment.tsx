import { useDispatch, useSelector } from 'react-redux';
import { setUser} from '../../features/userSlice';
import { setHeader} from '../../features/headerSlice';
import type { RootState } from '../../app/store';


function SelectDepartment() {

        const user = useSelector((state: RootState) => state.user);
        console.log('User from Redux store:', user);
  return (
    <div>
     <button onClick={() => { console.log('User from Redux store:', user);}}>user</button>
    </div>
  );
}

export default SelectDepartment;