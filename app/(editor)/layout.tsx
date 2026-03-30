import '@puckeditor/core/puck.css'

export const metadata = {
  title: 'Puck Editor',
}

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
