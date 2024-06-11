import useConfigLogo from '@/hooks/config'
import Image from 'next/image'

const ApplicationLogo = ({ className = '' }): JSX.Element => {
  const logo = useConfigLogo()

  return (
    <Image
      src={logo !== null ? logo : '/assets/images/LOGOCBT6.png'}
      alt="CBT SMAN 6 Bandung"
      width={200}
      height={200}
      className={className}
      priority
    />
  )
}

export default ApplicationLogo
