
import SignUpFormsComponent from '../components/signup/SignUpFormsComponent';


function SignUp(){
   return (
       <div className="flex items-center justify-center min-h-screen bg-gray-100">
           <div className="w-full max-w-xs">
               <h1 className="py-10 text-center text-2xl font-bold">Sign Up</h1>
               <SignUpFormsComponent/>
           </div>
       </div>
   )
}
export default SignUp;