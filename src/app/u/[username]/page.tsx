"use client";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useCompletion } from "ai/react";
// import { Form} from 'react-hook-form';
import { z } from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
const specialCharacter = "||";
const parseStringmessage = (messageString: string): string[] => {
  return messageString.split("||");
};
const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";
const MessageProfilePage = () => {
  const {
    complete,
    isLoading: isSuggestLoading,
    error,
    completion,
  } = useCompletion({
    api: "/api/suggest-messages",
    initialCompletion: initialMessageString,
  });
  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };
  const params = useParams<{ username: string }>();
  const username = params.username;
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });
  const { toast } = useToast();
  form.watch("content");
  const messageContent = form.watch("content");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      console.log("this is data :", data);
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });
      console.log("this is a response", response.data);
      toast({
        title: "message sent successfully",
        description: response.data?.message,
        variant: "destructive",
      });
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log(
        "this is response of error ",
        axiosError.response?.data.message
      );
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to sent message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const fetchSuggestMessages = async () => {
    try {
      complete("");
    } catch (error) {
      console.log("Error fetching messages:");
    }
  };

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !messageContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>
      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={fetchSuggestMessages}
            className="my-4"
            disabled={isSuggestLoading}
          >
            Suggest Messages
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {error ? (
              <p className="text-red-500">{error.message}</p>
            ) : (
              parseStringmessage(completion).map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MessageProfilePage;
