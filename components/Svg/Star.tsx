import { SVG } from '../../types/svg'

// width="24"
// height="24"

export type StarVariants = 'outline' | 'fill'
export interface StarProps extends SVG {
  variant?: StarVariants
}
export const Star: React.FC<StarProps> = ({
  variant = 'outline',
  ...rest
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="#F1C40F"
      viewBox="0 0 24 24"
      {...rest}
    >
      {variant === 'outline' && (
        <path
          fillRule="evenodd"
          // eslint-disable-next-line max-len
          d="M6.17 14.894l-1.376 8.024L12 19.13l7.206 3.788-1.376-8.024 5.83-5.682-8.057-1.171L12 .74l-3.603 7.3L.34 9.21l5.83 5.683zm9.51-.698l.87 5.066L12 16.87l-4.55 2.392.87-5.066-3.682-3.588 5.087-.74L12 5.261l2.275 4.609 5.086.74-3.68 3.587z"
          clipRule="evenodd"
        />
      )}
      {variant === 'fill' && (
        <path
          fillRule="evenodd"
          d="M12 19.13l-7.206 3.788 1.376-8.024L.34 9.212 8.397 8.04 12 .74l3.603 7.3 8.056 1.17-5.83 5.683 1.377 8.024L12 19.13z"
          clipRule="evenodd"
        />
      )}
    </svg>
  )
}
