"use client";

import { useAuth } from "@/hooks/useAuth";

type AuthorizedImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  alt?: string;
};

export default function AuthorizedImage({ alt = "", ...props }: AuthorizedImageProps) {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500">
        Accès restreint
      </div>
    );
  }

  return <img alt={alt} {...props} />;
}
