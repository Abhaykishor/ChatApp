import React, { useEffect, useState } from 'react'
import { PiChatsCircleFill } from "react-icons/pi";
import { FaUserPlus } from "react-icons/fa";
import { CgLogOut } from "react-icons/cg";
import { NavLink, useNavigate} from 'react-router-dom';
import Avtar from './Avtar';
import { useDispatch, useSelector } from 'react-redux';
import EditUserDetails from './EditUserDetails';
import { GoArrowUpLeft } from "react-icons/go";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import SearchUser from './SearchUser';
import { logout } from '../redux/UserSlice';


const Sidebar = () => {

    const user = useSelector(state => state?.user)
    const [editUserOpen,setEditUserOpen] = useState(false)
    const [allUser , setAllUser] = useState([])
    const [openSearchUser , setOpenSearchUser] = useState(false)
    const socketConnection = useSelector(state => state?.user?.socketConnection)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(()=>{
        if(socketConnection){
            socketConnection.emit('sidebar',user._id)
            
            socketConnection.on('conversation',(data)=>{
                console.log('conversation',data)
                
                const conversationUserData = data.map((conversationUser,index)=>{
                    if(conversationUser?.sender?._id === conversationUser?.receiver?._id){
                        return{
                            ...conversationUser,
                            userDetails : conversationUser?.sender
                        }
                    }
                    else if(conversationUser?.receiver?._id !== user?._id){
                        return{
                            ...conversationUser,
                            userDetails : conversationUser.receiver
                        }
                    }else{
                        return{
                            ...conversationUser,
                            userDetails : conversationUser.sender
                        }
                    }
                })

                setAllUser(conversationUserData)
            })
        }
    },[socketConnection,user])

    const handleLogout = ()=>{
        dispatch(logout())
        navigate("/email")
        localStorage.clear()
    }


  return (
    <div className=' w-full h-full grid grid-cols-[48px,1fr] bg-white'>
      <div className='bg-slate-200 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between'>
            <div>
                <NavLink className={ ({isActive})=> `w-12 h-12 flex cursor-pointer justify-center item-center rounded hover:bg-slate-200 ${isActive && "bg-slate-300"} `} title = 'chat'>
                <PiChatsCircleFill 
                    size={20}/>
                </NavLink>

                <div title='add-friend' onClick={() =>setOpenSearchUser(true)} className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded'>
                <FaUserPlus 
                    size={20}/>

                </div>
            </div>
            <div className='flex flex-col item-center'>
                <button className='mx-auto mb-4' title={user?.name } onClick={()=>setEditUserOpen(true)} >
                    < Avtar
                        height={35}
                        width={35}
                        name = {user?.name}
                        imageUrl={user?.profile_pic }
                        userId={user?._id}
                    />
                </button>
                    <div>

                    </div>
                {/* </button> */}


                <button title='logout' className='w-12 h-12 flex cursor-pointer justify-center item-center hover:bg-slate-200 'onClick={handleLogout}>
                    <span className=''>
                        <CgLogOut  
                        size={25}/>
                    </span>
                </button>
            </div>
      </div>

      <div className='w-full '>
            <div className='h-16 flex items-center '>
                <h2 className='text-xl font-bold p-4 text-slate-800 '>
                    Message
                </h2>
            </div>
            <div className='bg-slate-200 p-[0.5px]'>

            </div>
            <div className=' h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar'>
                {
                    allUser.length === 0  && (
                        <div className='mt-5 '>
                            <div className='flex justify-center items-center my-4 text-slate-500'>
                                <GoArrowUpLeft 
                                    size={50}
                                />
                            </div>
                            <p className="text-lg text-center text-slate-400 ">
                                Explore users to start conversation with.
                            </p>
                        </div>
                    )
                }
                {

                    allUser.map((con,index)=>{
                        return(
                            <NavLink to={"/"+con?.userDetails?._id} key={con?._id} className='flex items-center gap-2 py-3 px-2 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer'>
                                <div>
                                    <Avtar
                                        imageUrl={con?.userDetails?.profile_pic}
                                        name={con?.userDetails?.name}
                                        width={40}
                                        height={40}
                                        // userId={user?._id}
                                    />    
                                </div>
                                <div>
                                    <h3 className='text-ellipsis line-clamp-1 font-semibold text-base'>{con?.userDetails?.name}</h3>
                                    <div className='text-slate-500 text-xs flex items-center gap-1'>
                                        <div className='flex items-center gap-1'>
                                            {
                                                con?.lastMsg?.imageUrl && (
                                                    <div className='flex items-center gap-1'>
                                                        <span><FaImage/></span>
                                                        {!con?.lastMsg?.text && <span>Image</span>  } 
                                                    </div>
                                                )
                                            }
                                            {
                                                con?.lastMsg?.videoUrl && (
                                                    <div className='flex items-center gap-1'>
                                                        <span><FaVideo/></span>
                                                        {!con?.lastMsg?.text && <span>Video</span>}
                                                    </div>
                                                )
                                            }
                                        </div>
                                        <p className='text-ellipsis line-clamp-1'>{con?.lastMsg?.text}</p>
                                    </div>
                                    {/* <p className='text-ellipsis line-clamp-1'>{con?.lastMsg?.text}</p> */}
                                </div>
                                {
                                    Boolean(con?.unseenMsg) && (
                                        <p className='text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-primary text-white font-semibold rounded-full'>{con?.unseenMsg}</p>
                                    )
                                }

                            </NavLink>
                        )
                    })

                }
            </div>
      </div>





      {/**EditUserDetails */}
      {
        editUserOpen && (
            <EditUserDetails onClose = {()=>setEditUserOpen(false)} user = {user}/>
        )
      }

      {/* Search user */}
      {
        openSearchUser && (
            <SearchUser onClose ={() => setOpenSearchUser(false)}/>
            // <SearchUser/>
        )
      }


    </div>
  )
}

export default Sidebar
