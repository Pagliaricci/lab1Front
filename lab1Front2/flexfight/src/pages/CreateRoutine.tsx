import CRForm from '../components/createRoutine/CRFormsComponent';

function createRoutine() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mt-8 mb-8">Create Routine</h1>
      <CRForm />
    </div>
  );
}

export default createRoutine;