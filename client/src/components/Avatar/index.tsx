import { User as UserIcon } from "lucide-react";

interface AvatarProps {
  src?: string;
  size?: number | string;
}

function Avatar({ size = 50, src }: AvatarProps) {
  return (
    <div
      style={{ width: size, height: size }}
      className="bg-white rounded-full flex justify-center items-center overflow-hidden border-2 border-slate-500">
      {src ? (
        <img className="size-full object-cover" src={src} alt="" />
      ) : (
        <UserIcon className="size-[60%]" />
      )}
    </div>
  );
}

export default Avatar;
