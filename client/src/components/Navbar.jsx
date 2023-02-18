//Navbar
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { AvatarGenerator } from "random-avatar-generator";
import { useAuth } from "@arcana/auth-react";

const Navbar = () => {
  const auth = useAuth();
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [avatar, setAvatar] = useState(null);

  // const connectWalletHandler = (isClicked) => {
  //   if (
  //     window.ethereum != null &&
  //     window.ethereum.isMetaMask === true &&
  //     window.ethereum.isConnected() === true
  //   ) {
  //     // set ethers provider
  //     setProvider(new ethers.providers.Web3Provider(window.ethereum));

  //     // connect to metamask
  //     window.ethereum
  //       .request({ method: "eth_requestAccounts" })
  //       .then((result) => {
  //         console.log(result);
  //         // setConnButtonText("Wallet Connected");
  //         if (isClicked) {
  //           toast.success("Wallet Connected");
  //         }
  //         setIsLoggedin(true);
  //         setDefaultAccount(result[0]);
  //         const generator = new AvatarGenerator();
  //         localStorage.setItem("defaultAccount", JSON.stringify(result[0]));
  //         localStorage.setItem("userBalance", JSON.stringify(result[0]));
  //         setAvatar(generator.generateRandomAvatar());
  //       })
  //       .catch((error) => {
  //         // setErrorMessage(error.message);
  //       });
  //   } else {
  //     console.log("Need to install MetaMask and enable it on this tab");
  //     toast.error(
  //       "Please install MetaMask browser extension and enable it on this tab to interact "
  //     );
  //     // setErrorMessage("Please install MetaMask browser extension to interact");
  //   }
  // };

  const setAccount = () => {
    const result = auth.user;
    console.log(result);
    if (result) {
      toast.success("Logged in");
      setIsLoggedin(true);
      localStorage.setItem("defaultAccount", JSON.stringify(result.address));
      localStorage.setItem("selectedAddress", JSON.stringify(result.address));
      setAvatar(result.picture);
    }
  };

  const loginWithArcana = async () => {
    await auth
      .loginWithSocial("github")
      .then((result) => {
        setAccount();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error logging in");
      });
  };

  const logout = () => {
    auth.logout();
    localStorage.clear();
    setIsLoggedin(false);
    toast("Logged Out");
    // window.location.reload();
  };

  useEffect(() => {
    if (auth.user) {
      const result = auth.user;
      console.log(result);
      if (result) {
        setIsLoggedin(true);
        localStorage.setItem("defaultAccount", JSON.stringify(result.address));
        setAvatar(result.picture);
      }
    }
  }, [auth.user]);

  return (
    <div className="w-11/12 md:mr-10 md:ml-10 ml-5 mt-5 rounded-xl navbar ">
      <div className="flex-1">
        <a className=" normal-case text-xl" href="/">
          Proxima
        </a>
      </div>
      <div className="flex-none">
        {!isLoggedin && (
          <div className="dropdown dropdown-end flex gap-3">
            <button
              className="justify-between"
              onClick={() => loginWithArcana()}
            >
              Log in with Github
            </button>
          </div>
        )}

        {isLoggedin && (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src={avatar} />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a href="/dashboard" className="justify-between">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/scheduled-meetings" className="justify-between">
                  Scheduled Meetings
                </a>
              </li>
              <li onClick={logout}>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
