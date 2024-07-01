"use client";
import { useEffect, useState } from "react";
import { User } from "@/models/User";
import axios, { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Loader2 } from "lucide-react";
const GetUsers: React.FC = () => {
  const [users, setUsers] = useState<string[]>([]);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [TotalPages, setTotalPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const { toast } = useToast();
  const [Loading, setisLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `/api/get-alluser?pagenumber=${pageNumber}`
        );
        console.log("this is a pagenumber", pageNumber);
        setUsers(response.data.namesArray as string[]);
        setHasNextPage(response.data.hasNextpage);
        setTotalPages(response.data.Totalpages);
        toast({
          title: "Fetched usersnames successfully",
          variant: "destructive",
        });
      } catch (error) {
        const axiosError = error as AxiosError;

        console.log("Error get users", axiosError.response?.data);
        toast({
          title: "Error in get users",
          variant: "destructive",
        });
      } finally {
        setisLoading(false);
      }
    };
    fetchUsers();
  }, [pageNumber]);
  const router = useRouter();
  const handlePreviouspage = () => {
    if (pageNumber <= 1) {
      toast({
        title: "Last page ",
      });
      return;
    }
    setPageNumber((pageNumber) => pageNumber - 1);
  };
  const handleNextpage = () => {
    if (!hasNextPage) {
      toast({
        title: "Last page",
      });
      return;
    }
    setPageNumber((page) => page + 1);
  };
  console.log("this is a type of users", typeof users);
  return (
    <div className="min-h-screen bg-white flex flex-col p-2 ">
      <h1 className="text-center text-3xl font-bold "> Verfified Users List</h1>
      <div className="flex flex-col gap-2 ">
        {users.map((user) => (
          <Button className="bg-slate-600 flex justify-between p-10">
            {user}
            <Button
              onClick={() => {
                router.replace(`/u/${user}`);
              }}
            >
              Send Message
            </Button>
          </Button>
        ))}
      </div>
      {
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={handlePreviouspage} />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                {pageNumber > 1 && pageNumber - 1}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                {hasNextPage && pageNumber + 1}
              </PaginationLink>
            </PaginationItem>
            {hasNextPage && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext onClick={handleNextpage} href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      }
    </div>
  );
};

export default GetUsers;
