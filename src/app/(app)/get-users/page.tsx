"use client";
import { useEffect, useState } from "react";
import { User } from "@/models/User";
import axios, { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
const GetUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [TotalPages, setTotalPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `/api/get-alluser?pagenumber=${pageNumber}`
        );
        setUsers(response.data?.result);
        setHasNextPage(response.data?.hasNextpage);
        setTotalPages(response.data.Totalpages);
      } catch (error) {
        const axiosError = error as AxiosError;

        console.log("Error get users", axiosError.response?.data);
        toast({
          title: "Error in get users",
          variant: "destructive",
        });
      }
    };
    fetchUsers();
  }, []);
  return <div className="min-h-screen bg-white flex flex-col "></div>;
};

export default GetUsers;
