'use client'

import { useState } from 'react'
import { useQuickCaptureStore } from '@/lib/store'
import { Modal } from '@/components/ui'
import { Textarea } from '@/components/ui'
import { Button } from '@/components/ui'
import { X } from 'lucide-react'

export function QuickCapture() {
  const { isOpen, close } = useQuickCaptureStore()
  const [note, setNote] = useState('')

  const handleSave = () => {
    // TODO: Save to database
    console.log('Quick capture:', note)
    setNote('')
    close()
  }

  return (
    <Modal isOpen={isOpen} onClose={close} title="Quick Capture">
      <div className="space-y-4">
        <Textarea
          placeholder="Capture an idea, task, or note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={6}
          autoFocus
        />
        
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={!note.trim()}>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  )
}