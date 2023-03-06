import { useState } from "react";

const ProfileSetupPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [privateProfile, setPrivateProfile] = useState(true);

  return (
    <div>
      <form>
        <label>
          First Name
          <input type="text" name="fname" placeholder="Enter your first name" />
        </label>
        <label>
          Last Name
          <input type="text" name="lname" placeholder="Enter your last name" />
        </label>
        <label>
          Bio
          <textarea name="bio" placeholder="Tell people who you are." />
        </label>
        <input type="submit" value="Update" />
      </form>
    </div>
  );
};

export default ProfileSetupPage;
