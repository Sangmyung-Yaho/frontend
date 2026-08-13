import { type ImgHTMLAttributes } from 'react';

export interface LogoCardProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  iconClassName?: string;
}

function LogoCard({ src, alt = '', className = '', iconClassName = '', ...props }: LogoCardProps) {
  return (
    <div
      className={`flex h-[132px] w-[132px] shrink-0 items-center justify-center overflow-hidden rounded-[30px] bg-white shadow-[0_3px_5px_0_rgba(0,0,0,0.25)] aspect-square ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className={`h-auto max-h-full w-auto max-w-full object-contain ${iconClassName}`}
        {...props}
      />
    </div>
  );
}

export default LogoCard;
