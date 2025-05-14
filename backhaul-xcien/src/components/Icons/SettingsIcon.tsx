export default function SettingsIcon({
    fill = "currentColor",
    size,
    height,
    width,
    ...props
}: {
    fill?: string;
    size?: number;
    height?: number;
    width?: number;
    [key: string]: any;
}) {
    return (
        <svg
            data-name="Iconly/Curved/Profile"
            height={size || height || 24}
            viewBox="0 0 24 24"
            width={size || width || 24}
            xmlns="http://www.w3.org/2000/svg"
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
                <path d="M14 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M4 6l8 0" />
                <path d="M16 6l4 0" />
                <path d="M8 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M4 12l2 0" />
                <path d="M10 12l10 0" />
                <path d="M17 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M4 18l11 0" />
                <path d="M19 18l1 0" />
            </g>
        </svg>
    );
}
