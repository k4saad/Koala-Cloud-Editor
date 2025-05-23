import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import koalaImage from "../../assets/images/cool-koala.png";
import { signup } from '../utils/api';
import LoadingScreen from '../common/LoadingScreen';

export function Signup() {

  const [user,setUser] = useState({
    name : "",
    email : "",
    username : "",
    password : ""
  })

  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  

  const handleInputChange = (e) => {
		setUser({ ...user, [e.target.name]: e.target.value })
	}

  const handleSubmit = async (e) => {
		e.preventDefault()
    setIsLoading(true);
		try {
			const response = await signup(user)
			setSuccessMessage(response)
			setErrorMessage("")
			setUser({ name : "", email : "", username : "", password : "" })
      navigate("/signin")
      setIsLoading(false)
		} catch (error) {
      setSuccessMessage("")
			setErrorMessage(`Registration error : ${error.message}`)
      setIsLoading(false)
		}		
	}

  return (
    <section className="top-0 h-screen pt-5 relative overflow-x-hidden bg-[#060707]">
        <>
            <div className="bg-[#15d98bfd] h-[181px] w-[181px] lg:h-[362px] lg:w-[362px] absolute rounded-full blur-[60px] lg:blur-[120px] filter -top-[100px]  -left-20 opacity-75"></div>
        </>
        <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md mx-auto w-full md:max-w-sm max-w-xs">
        <div className="mb-2 flex justify-center">
          <Link
              to="/"
              >
              <img
                  src={koalaImage}
                  alt="kool koala"
                  width="100"
                  height="100"
              />
            </Link>
        </div>
          <h2 className="text-center text-2xl text-[#EFEDE7] font-Heavitas leading-tight ">
          Sign up to create an account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400 ">
            Already have an account?{' '}
            <Link
              to="/signin"
              className="font-TypewcondRegular font-semibold text-[#02C173] transition-all duration-200 hover:underline"
            >
              Sign In
            </Link>
          </p>
          <form onSubmit={handleSubmit} className="br mt-8">
            <div className="space-y-5">
                <div>
                    <label htmlFor="" className="text-base font-medium text-[#02C173]">
                    {' '}
                    Full Name{' '}
                    </label>
                    <div className="mt-2">
                    <input
                        className="flex h-10 w-full rounded-md border text-[#02C173] font-semibold border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#15d98bfd] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                        id='name'
                        name='name'
                        type="text"
                        value={user.name}
                        onChange={handleInputChange}
                        placeholder="Full Name"
                        required
                    ></input>
                    </div>
              </div>
              <div>
                    <label htmlFor="" className="text-base font-medium text-[#02C173]">
                    {' '}
                    Email{' '}
                    </label>
                    <div className="mt-2">
                    <input
                        className="flex h-10 w-full rounded-md border text-[#02C173] font-semibold border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#15d98bfd] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                        id='email'
                        name='email'
                        type="text"
                        value={user.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        required
                    ></input>
                    </div>
              </div>
              <div>
                <label htmlFor="" className="text-base font-medium text-[#02C173]">
                  {' '}
                  Username{' '}
                </label>
                <div className="mt-2">
                  <input
                    className="flex h-10 w-full rounded-md border text-[#02C173] font-semibold border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#15d98bfd] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    id="username"
                    name="username" 
                    type="username"
                    value={user.username}
                    onChange={handleInputChange}
                    placeholder="Username"
                    required
                  ></input>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="" className="text-base font-medium text-[#02C173]">
                    {' '}
                    Password{' '}
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    className="flex h-10 w-full rounded-md border text-[#02C173] font-semibold border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#15d98bfd] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    id="password"
                    name="password"
                    value={user.password}
                    onChange={handleInputChange}
                    type="password"
                    placeholder="Password"
                    required
                  ></input>
                </div>
              </div>
              {
                errorMessage && 
                <p className="mt-2 text-center text-sm font-TypewcondRegular text-red-600 ">
                {errorMessage}
              </p>
              }
              {
                successMessage && 
                <p className="mt-2 text-center text-sm font-TypewcondRegular text-[#02C173] ">
                {successMessage}
              </p>
              }
              <div>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-md  bg-[#02C173] hover:bg-[#15d98bfd] px-3.5 py-2.5 font-semibold leading-7 text-[#EFEDE7] "
                >
                  Sign Up 
                </button>
              </div>
            </div>
          </form>
        </div>
    </section>
  )
}

export default Signup;