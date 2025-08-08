
import { AiOutlineLinkedin } from 'react-icons/ai';
import { MdOutlineAlternateEmail } from 'react-icons/md';
import { TbBrandGithub } from 'react-icons/tb';
import { FaInstagram } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';


const AdminProfile = ({ currentUser }) => (
  <div className="w-full flex items-center justify-center bg-black">
    <div className="relative w-full max-w-2xl lg:h-[500px] mx-auto my-8 px-6 py-8 bg-    :bg-gray-900 border border-gray-300 rounded-xl shadow-md">

      {/* Verified Badge */}


      {/* Grid Layout */}
      <div className="flex flex-col text-center gap-6 items-center">

        {/* Profile Image */}
        <div className="flex flex-col lg:mt-16 mx-auto">
          <img
            src={currentUser.profileImage || '/user.avif'}
            alt="Admin Profile"
            className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded border border-primary-100 shadow-md"
          />
        </div>


        {/* Info Section */}
        <div className="flex flex-col items-center mx-auto text-center">
          <h2 className="text-2xl font-semibold  text-white font-display">
            {currentUser.name}
          </h2>


          <span className="  text-xs font-medium px-3 py-1 bg-green-100  rounded text-green-700   border border-green-300 ">
            Admin Profile {currentUser.isVerified ? 'Verified' : 'Not Verified'}
          </span>

          <p className="text-sm text-white  ">{currentUser.email}</p>
          <p className="mt-2 text-base text-white  ">
            {currentUser.field || 'Admin - Computer Science'}
          </p>
          <p className="mt-2 text-sm text-white  ">
            {currentUser.description || 'Admin of the platform. Responsible for managing content and user queries.'}
          </p>

          {/* Social Icons */}
          <div className="mt-4 flex gap-4">
            <a
              data-tooltip-id="profile-tooltip"
              data-tooltip-content="LinkedIn Profile"
              href={currentUser.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <AiOutlineLinkedin className="text-2xl text-white   hover:text-blue-600 transition" />
            </a>

            <a
              data-tooltip-id="profile-tooltip"
              data-tooltip-content="Portfolio Website"
              href={currentUser.portfolio}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MdOutlineAlternateEmail className="text-2xl text-white   hover:text-purple-600 transition" />
            </a>

            <a
              data-tooltip-id="profile-tooltip"
              data-tooltip-content="GitHub Repositories"
              href={currentUser.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <TbBrandGithub className="text-2xl text-white   hover:text-gray  transition" />
            </a>

            <a
              data-tooltip-id="profile-tooltip"
              data-tooltip-content="Instagram Profile"
              href={currentUser.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="text-2xl text-white   hover:text-pink-500 transition" />
            </a>

            <Tooltip id="profile-tooltip" place="bottom" style={{ zIndex: 9999 }} />
          </div>



        </div>
      </div>
    </div>
  </div>
);

export default AdminProfile;
