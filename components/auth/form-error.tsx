import { AlertCircle } from "lucide-react";

interface FormErrorMsgProps {
  message: string;
}

export const FormErrorMsg = ({ message }: FormErrorMsgProps) => {
  if (!message || message === "") return null;

  return (
    <div className="flex space-x-3 text-sm items-center p-2 rounded-lg text-red-500 bg-red-500/30">
      <AlertCircle className="w-4 h-4" />
      <span>{message}</span>
    </div>
  );
};
