import { useContext } from 'react'
import { SkeletonTheme } from 'react-loading-skeleton'
import { AuthContext } from '../Context/AuthContext'

const AppSkeletonTheme = ({ children }) => {
  const { theme } = useContext(AuthContext)
  const isDark = theme === 'dark'

  return (
    <SkeletonTheme
      baseColor={isDark ? '#071A1D' : undefined}
      highlightColor={isDark ? '#12363B' : undefined}
    >
      {children}
    </SkeletonTheme>
    
  )
}

export default AppSkeletonTheme