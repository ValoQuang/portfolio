export type User = {
  email: string;
  username: string;
  profilePicture: string;
  isAdmin: boolean;
  _id: string;
};

export type DashComment = {
  createdAt?: string;
  _id: string;
  content: string;
  postId: string;
  userId: string;
  likes: number[];
  numberOfLikes: number;
  updatedAt: string;
};

export type UserPost = {
  createdAt?: string;
  _id?: string;
  userId: string;
  content: string;
  title: string;
  image: string;
  category: string;
  slug: string;
  updatedAt: string;
};

export type PostCardType = {
  _id: string;
  post: {
    id: any;
    slug: any;
    image: string;
    title: string;
    category: string;
  };
};

export type FormData = {
  email: string;
  password: string;
  username?: string;
};

