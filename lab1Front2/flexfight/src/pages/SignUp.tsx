import SignUpFormsComponent from '../components/signup/SignUpFormsComponent';


function SignUp(){
   return (
       <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
           <div className="w-full max-w-2xl">
               <div className="text-center mb-8">
                   <h1 className="text-4xl font-bold text-orange-600 mb-2">
                       Join FlexFight
                   </h1>
                   <p className="text-gray-600">Create your account and start your fitness journey today</p>
               </div>
               <SignUpFormsComponent/>
           </div>
       </div>
   )
}
export default SignUp;