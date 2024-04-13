export type User = {
  email: string;
  username: string;
  profilePicture: string;
  isAdmin: boolean;
  _id: string;
};

export type DashComment = {
  _id: string;
  content: string;
  postId: string;
  userId: string;
  likes: number[];
  numberOfLikes: number;
  updatedAt: string;
};

export type UserPost =  {
    _id: string,
    userId: string,
    content: string,
    title: string,
    image: string,
    category: string,
    slug: string,
    updatedAt: string,
  }