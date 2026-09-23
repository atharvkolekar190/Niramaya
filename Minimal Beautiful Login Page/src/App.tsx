import { FeaturePanel } from "./components/FeaturePanel";
import { LoginForm } from "./components/LoginForm";

export default function App() {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Features & Marketing */}
      <div className="hidden lg:flex lg:w-1/2">
        <FeaturePanel />
      </div>
      
      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2">
        <LoginForm />
      </div>
    </div>
  );
}