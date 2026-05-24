import { useState } from 'react'
import Section from '@/components/shared/Section'
import NameInput from './components/NameInput'
import ParticipantList from './components/ParticipantList'
import { useMembers } from './hooks/useMembers'

function SectionParticipant() {
  const { members, addMember, removeMember } = useMembers()

  const [name, setName] = useState<string>('')
  const [inputNameError, setInputNameError] = useState<string>('')

  const handleAddMember = () => {
    try {
      addMember(name)
    } catch (error) {
      setInputNameError((error as Error).message)
      return
    }
    setInputNameError('')
    setName('')
  }

  return (
    <Section title="Participants">
      <NameInput name={name} setName={setName} onAdd={handleAddMember} inputError={inputNameError} />
      <ParticipantList members={members} onRemove={removeMember} />
    </Section>
  )
}

export { SectionParticipant }
