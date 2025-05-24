export default function OpenDrawerIcon({
  fill = "currentColor",
  size,
  height,
  width,
  rotate = 0, // new prop
  ...props
}: {
  fill?: string;
  size?: number;
  height?: number;
  width?: number;
  rotate?: number;
  [key: string]: any;
}) {
  return (
    <svg
      data-name="Iconly/Curved/Profile"
      height={size || height || 24}
      viewBox="0 0 24 24"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transition: "transform 0.3s",
        transform: `rotate(${rotate}deg)`,
      }}
      {...props}
    >
      <g
        fill="none"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M7 6v12" />
        <path d="M18 6l-6 6l6 6" />
      </g>
    </svg>
  );
}
