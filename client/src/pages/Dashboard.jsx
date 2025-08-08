import { useState, useEffect, useRef } from 'react';
import { FaUser, FaUsers, FaCube, FaChartLine, FaCog, FaHeart, FaUserShield, FaUserLock, FaFile } from 'react-icons/fa';
import {
  getUser, set_verification_Email, setToken,
  setUser as set_user_localStorage, removeUser, setUser
} from '../utils/auth';
import { apiAuthHandle } from '../config/apiAuthHandle.js';
import axios from 'axios';
import apiUploadHandle from '../config/apiUploadHandle.js';
import toast, { Toaster } from 'react-hot-toast';
// Blog API removed
import { useNavigate } from 'react-router-dom';
import { ImProfile } from "react-icons/im";
import { MdOutlineQuestionAnswer } from "react-icons/md";

import UserProfile from '../dashboard/UserDashboard/UserProfile';
import UserFavorites from '../dashboard/UserDashboard/UserFavorites';
import UserSettings from '../dashboard/UserDashboard/UserSettings';
import AdminDashboard from '../dashboard/AdminDashboard/AdminDashboard';
import AdminProfile from '../dashboard/AdminDashboard/AdminProfile';
import AdminSettings from '../dashboard/AdminDashboard/AdminSettings';
import AdminUsers from '../dashboard/AdminDashboard/AdminUsers';
import AllQuries from '../dashboard/AdminDashboard/AllQuries.jsx';
import UserQuires from '../dashboard/UserDashboard/UserQuries.jsx';
import apiQueryHandle from '../config/apiQueryHandle.js';
import apiAdminAnsHandle from '../config/apiAdminAnsHandle.js';

const Dashboard = () => {

  const currentUser = getUser()

  useEffect(() => {
    if (currentUser.role === 'admin') {
      getUsersData();
      // Blog logic removed
    }
  }, [currentUser.role]);

  const goto = useNavigate()

  const [activeTab, setActiveTab] = useState('dashboard');

  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

  // Close sidebar on mobile screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    // Initial check
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const [users, setUsers] = useState([]);
  // Blog state removed
  // get users data
  const getUsersData = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await apiAuthHandle.get(`/getUserData`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(data?.data);
      console.log(data?.data);

      toast.success('Fetched users successfully');


    } catch (error) {
      toast.error('Error fetching users');
      console.error('Error fetching users:', error);
    }
  };
  // delete user
  const deleteUser = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await apiAuthHandle.delete(`/deleteUserData/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(data?.message);

      getUsersData()
    } catch (error) {
      toast.error(error.message);
      console.error('Error in deleting user:', error);
    }
  };

  // get Stats
  const [analytics, setAnalytics] = useState({});

  // Fetch admin stats (questions, users, answers)
  const getStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await apiAdminAnsHandle.get('/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Stats fetched successfully");
      setAnalytics(data?.stats);
    } catch (error) {
      console.error("Error fetching stats:", error?.response?.data || error.message);
      toast.error("Failed to fetch stats");
    }
  };


  // get formatted Data
  function formatCustomDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'short' });
    return `${day}-${month}-${year}`;
  }
  // admin can add user 
  let [addUserModal, setAddUserModal] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handle_AddUser_Change = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // add user (admin)
  const handleAddUser = async (e) => {
    e.preventDefault();


    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      console.log(error);
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      console.log(error);

      return;
    }


    try {
      const response = await apiAuthHandle.post(`/register`, formData);

      set_verification_Email(formData.email);
      setToken(response.data.token);
      set_user_localStorage(response.data.user);

      toast.success(response.data.message);

      setAddUserModal(false)

      setTimeout(() => {

        goto('/verify-otp', {
          state: {
            email: formData.email,
            message: response.data.message,
            otp: response.data.otp
          }
        });
      }, 2000)

    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      console.log(error.response?.data);

    }

  };


  // logout user (self)
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await apiAuthHandle.post('/logout', {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);

      removeUser()

      setTimeout(() => {
        goto('/login');
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Logout failed');
    }
  };




  // update user (self)
  const [updateUser, setUpdateUser] = useState({
    username: currentUser.name || '',
    useremail: currentUser.email || '',
    linkedin: currentUser.linkedin || '',
    portfolio: currentUser.portfolio || '',
    instagram: currentUser.instagram || '',
    github: currentUser.github || '',
    description: currentUser.description || '',
    field: currentUser.field || '',
    image: null
  });

  const updateImage = useRef(null);

  const handleUserSettingsChange = (e) => {
    const { name, value } = e.target;
    setUpdateUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUpdateUser((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  // UpdateProfile 
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      console.log(token);

      const formData = new FormData();

      // 1. Image upload first (if selected)
      let imageUrl = null;
      if (updateUser.image) {
        const imageForm = new FormData();
        imageForm.append('file', updateUser.image); // assuming updateUser.image is a File object

        const uploadRes = await apiUploadHandle.post('/', imageForm, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        imageUrl = uploadRes?.data?.url;
      }

      // 2. Append all fields to formData
      formData.append('name', updateUser.username);
      formData.append('email', updateUser.useremail);
      formData.append('linkedin', updateUser.linkedin);
      formData.append('portfolio', updateUser.portfolio);
      formData.append('instagram', updateUser.instagram);
      formData.append('github', updateUser.github);
      formData.append('description', updateUser.description);
      formData.append('field', updateUser.field);

      if (imageUrl) {
        formData.append('profileImage', imageUrl); // your backend must support this
      }

      // 3. Send update request to backend
      const { data } = await apiAuthHandle.put('/updateProfile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      // 4. Save updated user to localStorage and state
      setUser(data?.user); // or whatever your backend returns
      localStorage.setItem('user', JSON.stringify(data?.user));

      toast.success(data.message || 'Profile updated successfully');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Profile update failed');
    }
  };


  // Sidebar navigation
  const userNavItems = [
    // { id: 'home', label: 'Home', icon: FaHome },
    // { id: 'dashboard', label: 'Dashboard', icon: FaChartLine },
    { id: 'profile', label: 'Profile', icon: ImProfile },
    { id: 'quires', label: 'My Quires', icon: MdOutlineQuestionAnswer },
    { id: 'favorites', label: 'Favorites', icon: FaHeart },
    { id: 'settings', label: 'Settings', icon: FaCog },
    { id: 'login', label: 'Login', icon: FaUserShield },
    { id: 'logout', label: 'Logout', icon: FaUserLock },
  ];

  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaChartLine },
    { id: 'profile', label: 'Profile', icon: ImProfile },
    { id: 'users', label: 'Users', icon: FaUsers },
    { id: 'settings', label: 'Settings', icon: FaCog },
    { id: 'login', label: 'Login', icon: FaUserShield },
    { id: 'logout', label: 'Logout', icon: FaUserLock },
    // { id: 'home', label: 'Home', icon: FaHome },
    // { id: 'quires', label: 'Quires', icon: MdOutlineQuestionAnswer },
  ];

  const navItems = currentUser.role === 'admin' ? adminNavItems : userNavItems;

  const renderContent = () => {
    if (currentUser.role === 'admin') {
      switch (activeTab) {
        case 'home': return goto('/home');
        case 'login': return goto('/');
        case 'dashboard':
          return (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100">
                      <FaUsers className="text-blue-600 text-2xl" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.totalUsers}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100">
                      <FaUser className="text-green-600 text-2xl" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Verified Users</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.verifiedUsers}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-100">
                      <FaFile className="text-purple-600 text-2xl" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Total Q/A</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.totalQuestions}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-yellow-100">
                      <FaChartLine className="text-yellow-600 text-2xl" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Growth</p>
                      <p className="text-2xl font-bold text-gray-900">+{analytics.growth}%</p>
                    </div>
                  </div>
                </div>
              </div>

              < AdminDashboard />
            </div>

          );
        case 'users':
          return <AdminUsers
            analytics={analytics}
            users={users}
            setAddUserModal={setAddUserModal}
            addUserModal={addUserModal}
            handleAddUser={handleAddUser}
            handle_AddUser_Change={handle_AddUser_Change}
            formData={formData}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            handleLogout={handleLogout}
          />;
        case 'settings':
          return <AdminSettings updateUser={updateUser} updateImage={updateImage} handleUserSettingsChange={handleUserSettingsChange} handleImageChange={handleImageChange} handleUpdateProfile={handleUpdateProfile} handleLogout={handleLogout} currentUser={currentUser} />;
        case 'profile':
          return <AdminProfile currentUser={currentUser} />;
        case 'quires':
          return <AllQuries />;
        case 'logout':
          handleLogout();
          return null;
        default:
          return <AdminDashboard analytics={analytics} />;
      }
    } else {
      switch (activeTab) {
        case 'login':
          return goto('/');
        case 'dashboard':
          return goto('/dashboard');
        case 'profile':
          return <UserProfile currentUser={currentUser} />;
        case 'quires':
          return <UserQuires goto={goto} />;
        case 'favorites':
          return <UserFavorites />;
        case 'settings': return <UserSettings updateUser={updateUser} updateImage={updateImage} handleUserSettingsChange={handleUserSettingsChange} handleImageChange={handleImageChange} handleUpdateProfile={handleUpdateProfile} handleLogout={handleLogout} currentUser={currentUser} />;
        case 'logout':
          handleLogout();
          return null;
        default:
          return <UserProfile currentUser={currentUser} />;
      }
    }
  };

  useEffect(() => {
    setActiveTab(currentUser.role === 'admin' ? 'dashboard' : 'profile');
    if (currentUser.role === 'admin') {
      getStats();
    }
  }, [currentUser.role]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Toaster
        position="top-center"
        reverseOrder={false}
      />


      {/* Main Content */}
      <div className="flex-1 bg-black">
        {/* Header */}
        <div className="bg-green-100  shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h2 className="text-2xl md:flex hidden  font-bold text-gray-900 capitalize">
                  {currentUser.role} Dashboard
                </h2>
              </div>

              <div className="flex  items-center space-x-4">
                {/* <button className="text-gray-600 hover:text-gray-900">
                  <FaBell className="text-xl" />
                  <span className='absolute top-5 bg-red-400 rounded-full px-1 text-white font-semibold text-xs'>0</span>
                </button> */}
                <div className="flex items-center space-x-2">
                  <img src={currentUser.profileImage || '/user.avif'} alt="Profile" className="w-8 h-8 rounded-full" />
                  <span className="text-sm font-medium text-gray-900">{currentUser.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:p-6   bg-black p-2 overflow-y-auto no-scrollbar ">
          {renderContent()}
        </div>
      </div>

      <div className={`${sidebarOpen ? 'w-64' : 'w-14'} bg-white dark:bg-gray-900 shadow-lg transition-all duration-300 `}>

        {/* Profile Section */}

        <div className={`fixed top-0 right-0 h-full z-40 transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-14'} 
    bg-white dark:bg-gray-900 shadow-lg border-r border-gray-200 dark:border-gray-800`} >
          {/* Profile Section */}
          <div className="py-6 px-2 lg:px-2">
            <div className="flex flex-col items-center justify-center space-y-2">
              <img
                src={currentUser.profileImage || '/user.avif'}
                alt="Profile"
                className={`rounded-full border-2 border-primary-100 shadow-md transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-[100px]' : 'w-[50px]'
                  }`}
              />
              {sidebarOpen && (
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Name: {currentUser.name.charAt(0).toUpperCase() + currentUser.name.slice(1)}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                    Role: {currentUser.role}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="mt-4 space-y-1 p-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200 ${activeTab === item.id ? 'bg-green-100   border border-green-600 text-green-700 '
                    : 'text-gray-600  dark:text-gray-300 hover:bg-green-50  '}
          `}
                  title={!sidebarOpen ? item.label : ''}
                >
                  <div className="flex justify-center items-center w-6">
                    <Icon className="text-xl" />
                  </div>
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;