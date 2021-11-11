import { Switch, Flex, useColorMode, Image } from '@chakra-ui/react'
import { useCallback } from 'react'

const ThemeSwitcher = () => {
  const { colorMode, setColorMode } = useColorMode()

  const handleThemeChange = useCallback(
    (e) => {
      setColorMode(e.target.checked ? 'light' : 'dark')
    },
    [setColorMode]
  )

  const setDarkTheme = useCallback(() => {
    setColorMode('dark')
  }, [setColorMode])

  const setLightTheme = useCallback(() => {
    setColorMode('light')
  }, [setColorMode])

  return (
    <Flex align="center">
      <Image
        onClick={setDarkTheme}
        borderRadius="24"
        boxSize="24px"
        src="https://static.aviasales.com/selene-static/entrypoint/33b2481efe00026ca37f.svg"
      />
      <Switch
        p="1"
        size="md"
        isChecked={colorMode === 'light'}
        onChange={handleThemeChange}
      />
      <Image
        onClick={setLightTheme}
        borderRadius="24"
        boxSize="24px"
        src="https://static.aviasales.com/selene-static/entrypoint/94a68fe5e5ada1a6f9fe.svg"
      />
    </Flex>
  )
}

export default ThemeSwitcher
