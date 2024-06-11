import useConfigStore from '@/stores/config-store'
import { useEffect } from 'react'

const useConfigLogo = (): string | null => {
  const [logo, getLogo] = useConfigStore((state) => [state.logo, state.getLogo])

  useEffect(() => {
    void getLogo()
  }, [getLogo])

  return logo
}

export default useConfigLogo
