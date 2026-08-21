"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserType } from "../Types/UserType";
import { CommentType } from "../Types/CommentType";
import { Timestamp } from "next/dist/server/lib/cache-handlers/types";
type ContentContextType = {
  activeIndex: number,
  setActiveIndex: (index: number) => void,
  activeComment: boolean,
  setActiveComment: (state: boolean) => void,
  isCommentLoading: boolean,
  setIsCommentLoading: (state: boolean) => void,
  isVideoLoading: boolean,
  setIsVideoLoading: (state: boolean) => void,
  addComment: string,
  setAddComment: (value: string) => void,
  selectedParentId: number | null,
  setSelectedParentId: (value: number | null) => void,
  parentLimit: number | null,
  setParentLimit: (value: number | null) => void,
  childLimit: number | null,
  setChildLimit: (value: number | null) => void,
  comments:ParentComment[],
  setComments : (value : ParentComment[])=>void,
  // commentList: CommentType[],
  // setCommentList: (item:CommentType[]) => void
}

type usersType = {
  user_id: number;
  username: string;
  nickname: string;
  followers_count: number;
};


export type CommentItem = {
  comment_id: number;
  video_id: number;
  user_id: number;
  comment: string;
  parent_comment_id: number;
  level: number;
  create_time: Timestamp;
  user: usersType;
};


  export type ParentComment = {
    comment_id: number;
    video_id: number;
    user_id: number;
    comment: string;
    parent_comment_id: number;
    level: number;
    create_time: Timestamp;
    user: usersType;
    children: CommentItem[] | [];
  };
const ContentContext = createContext<ContentContextType | undefined>(undefined);

export default function ContentClients({ children }: { children: ReactNode }) {
  const [activeIndex, setActiveIndex] = useState(1);
  const [activeComment, setActiveComment] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isCommentLoading, setIsCommentLoading] = useState(true);
  const [addComment, setAddComment] = useState("");
  const [comments, setComments] = useState<ParentComment[]>([]);
  const [parentLimit, setParentLimit] = useState<number | null>(10);
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
  const [childLimit, setChildLimit] = useState<number | null>(10);


  // const [commentList, setCommentList];
  return (
    <ContentContext.Provider value={{
      activeIndex, setActiveIndex,
      activeComment, setActiveComment,
      isVideoLoading, setIsVideoLoading,
      isCommentLoading, setIsCommentLoading,
      addComment, setAddComment,
      selectedParentId, setSelectedParentId,
      parentLimit, setParentLimit,
      childLimit, setChildLimit,
      comments, setComments,
    }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContentContext() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("Use this context must be used within a ContentContext");
  }
  return context;
}
