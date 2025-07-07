import { Check } from "lucide-react";

interface FormSuccessMsgProps {
  message: string;
}

export const FormSuccessMsg = ({ message }: FormSuccessMsgProps) => {
  if (!message || message === "") return null;
  return (
    <div className="flex space-x-3 text-sm items-center p-2 rounded-lg text-emerald-500 bg-emerald-500/30">
      <Check className="w-4 h-4" />
      <span>{message}</span>
    </div>
  );
};
