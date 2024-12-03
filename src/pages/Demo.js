<div className="chat-header d-flex justify-content-between align-items-center">
    <div className="profile-avatar">
        {currentUserProfile && currentUserProfile.profilePicture ? (
            <img
                src={currentUserProfile.profilePicture}
                alt="Profile"
                className="avatar-img"
            />
        ) : (
            <span className="avatar-initials">
                {currentUserProfile
                    ? `${currentUserProfile.firstName[0]}${currentUserProfile.lastName[0]}`
                    : "??"}
            </span>
        )}
    </div>
</div>

// Video App Code
  // CORE-SDK
  import AgoraUIKit from 'agora-rn-uikit';

  const App = () => {
    const connectionData = {
      appId: 'e7f6e9aeecf14b2ba10e3f40be9f56e7',
      channel: 'test',
      token: null, // enter your channel token as a string 
      };
    return(
      <AgoraUIKit connectionData={connectionData} />
      )
  }

  export default App; 


  {
    "message": "Not Found",
    "documentation_url": "https://docs.github.com/rest",
    "status": "404"
  } 

//   App id : 97e93a0486d6445f95a831724dc8bc71
// primary key : a3f9a4e11cf943c4adba67621d9ab5ab
