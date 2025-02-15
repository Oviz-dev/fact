import { createContext, useContext } from "react";
import {ProcessMode, ProcessStatus} from '../types';

interface ApprovalProcessContextProps {
  processStatus?: ProcessStatus;
  setProcessStatus?: (status: ProcessStatus) => void;
  mode: ProcessMode;
}

export const ApprovalProcessContext = createContext<ApprovalProcessContextProps | null>(null);

export const useApprovalProcessContext = () => {
  const context = useContext(ApprovalProcessContext);
  if (!context) {
    throw new Error("useApprovalProcessContext должен использоваться с ApprovalProcessProvider");
  }
  return context;
};
