
const AdminSettings = ({ updateUser, updateImage, handleUserSettingsChange, handleImageChange, handleUpdateProfile,  currentUser }) => (

  <form
    className="space-y-8 container mx-auto divide-y rounded border border-green-500 divide-gray-200 px-4 py-8 w-full max-w-6xl bg-dark"
    onSubmit={handleUpdateProfile}
  >
    <div className="space-y-8 divide-y divide-gray-200 dark:divide-gray-700">
      <div>

        <div>
          <h3 className="text-3xl font-semibold text-white dark:text-gray-100 tracking-tight">
            Admin Profile Settings
          </h3>
          <p className="mt-2 text-sm text-white dark:text-gray-400">
            Manage your public-facing admin details. Ensure accuracy and professionalism across all linked platforms.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-6">
          {/* Profile Photo */}
          <div className="flex flex-col items-center justify-center">
            <label htmlFor="photo" className="block text-sm font-medium text-white dark:text-gray-300">
              Admin Profile Photo
            </label>
            <div className="mt-2 flex items-center">
              <span className="h-24 w-24 rounded border border-green-500 overflow-hidden bg-gray-100">
                <input
                  type="file"
                  name="image"
                  ref={updateImage}
                  className="hidden"
                  onChange={handleImageChange}
                />
                <img
                  onClick={() => updateImage.current.click()}
                  src={currentUser.avatar || '/user.avif'}
                  alt="User Avatar"
                  className="h-full w-full object-cover cursor-pointer"
                />
              </span>
            </div>
          </div>

          {/* Name & Email */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex flex-col">
              <label htmlFor="username" className="block text-sm font-medium   text-white">
                User Name
              </label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Enter name ..."
                className="shadow-sm p-2 text-lg outline-none block w-full border border-green-500 rounded-md"
                value={updateUser.username}
                onChange={handleUserSettingsChange}
              />
            </div>
            <div className="flex-1 flex flex-col">
              <label htmlFor="useremail" className="block text-sm font-medium  text-white">
                User Email
              </label>
              <input
                type="email"
                name="useremail"
                id="useremail"
                placeholder="Enter email ..."
                autoComplete="useremail"
                className="shadow-sm p-2 text-lg outline-none block w-full border border-green-500 rounded-md"
                value={updateUser.useremail}
                onChange={handleUserSettingsChange}
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex flex-col">
              <label htmlFor="linkedin" className="block text-sm font-medium   text-white">
                LinkedIn
              </label>
              <input
                type="text"
                name="linkedin"
                id="linkedin"
                placeholder="Enter LinkedIn link ..."
                className="shadow-sm p-2 text-lg outline-none block w-full border border-green-500 rounded-md"
                value={updateUser.linkedin}
                onChange={handleUserSettingsChange}
              />
            </div>
            <div className="flex-1 flex flex-col">
              <label htmlFor="portfolio" className="block text-sm font-medium   text-white">
                Portfolio
              </label>
              <input
                type="text"
                name="portfolio"
                id="portfolio"
                placeholder="Enter Portfolio live URL ..."
                className="shadow-sm p-2 text-lg outline-none block w-full border border-green-500 rounded-md"
                value={updateUser.portfolio}
                onChange={handleUserSettingsChange}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex flex-col">
              <label htmlFor="instagram" className="block text-sm font-medium   text-white">
                Instagram
              </label>
              <input
                type="text"
                name="instagram"
                id="instagram"
                placeholder="Enter Instagram link ..."
                className="shadow-sm p-2 text-lg outline-none block w-full border border-green-500 rounded-md"
                value={updateUser.instagram}
                onChange={handleUserSettingsChange}
              />
            </div>
            <div className="flex-1 flex flex-col">
              <label htmlFor="github" className="block text-sm font-medium   text-white">
                GitHub
              </label>
              <input
                type="text"
                name="github"
                id="github"
                placeholder="Enter GitHub URL ..."
                className="shadow-sm p-2 text-lg outline-none block w-full border border-green-500 rounded-md"
                value={updateUser.github}
                onChange={handleUserSettingsChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Buttons */}
    <div className="pt-5 w-full">
      <div className="flex flex-col sm:flex-row justify-between gap-2 w-full">
        
        <button
          type="submit"
          className="w-full sm:w-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Save Updates
        </button>
      </div>
    </div>
  </form>


);

export default AdminSettings;
