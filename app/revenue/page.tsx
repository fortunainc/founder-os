'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout'
import { Card, CardHeader, CardContent } from '@/components/ui'
import { Button } from '@/components/ui'
import { Badge } from '@/components/ui'
import { EmptyState } from '@/components/ui'
import { Modal } from '@/components/ui'
import { Input } from '@/components/ui'
import { Select } from '@/components/ui'
import { Textarea } from '@/components/ui'
import { 
  DollarSign, 
  Plus, 
  UserPlus, 
  Calendar,
  Mail,
  Phone,
  TrendingUp,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'

type ContactStage = 'new' | 'contacted' | 'meeting_scheduled' | 'proposal_sent' | 'negotiation' | 'closed_won' | 'closed_lost'

interface Contact {
  id: string
  name: string
  company: string
  email: string
  phone?: string
  stage: ContactStage
  value: number
  lastContact: string
  nextFollowUp?: string
  notes?: string
}

export default function RevenuePage() {
  const [contacts, setContacts] = useState<Contact[]>([
    { 
      id: '1', 
      name: 'John Smith', 
      company: 'TechCorp Inc', 
      email: 'john@techcorp.com',
      phone: '+1 555-0100',
      stage: 'proposal_sent', 
      value: 15000,
      lastContact: '2024-01-14',
      nextFollowUp: '2024-01-18',
      notes: 'Interested in enterprise plan',
    },
    { 
      id: '2', 
      name: 'Sarah Johnson', 
      company: 'Startup Labs', 
      email: 'sarah@startuplabs.io',
      stage: 'meeting_scheduled', 
      value: 8500,
      lastContact: '2024-01-15',
      nextFollowUp: '2024-01-20',
      notes: 'Demo scheduled for Friday',
    },
    { 
      id: '3', 
      name: 'Mike Chen', 
      company: 'Growth Co', 
      email: 'mike@growth.co',
      stage: 'new', 
      value: 12000,
      lastContact: '2024-01-13',
    },
  ])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [view, setView] = useState<'kanban' | 'list'>('kanban')

  const stages: ContactStage[] = [
    'new',
    'contacted',
    'meeting_scheduled',
    'proposal_sent',
    'negotiation',
    'closed_won',
    'closed_lost',
  ]

  const stageLabels: Record<ContactStage, string> = {
    new: 'New',
    contacted: 'Contacted',
    meeting_scheduled: 'Meeting Scheduled',
    proposal_sent: 'Proposal Sent',
    negotiation: 'Negotiation',
    closed_won: 'Closed Won',
    closed_lost: 'Closed Lost',
  }

  const stageColors: Record<ContactStage, 'default' | 'primary' | 'warning' | 'success' | 'danger'> = {
    new: 'default',
    contacted: 'primary',
    meeting_scheduled: 'warning',
    proposal_sent: 'primary',
    negotiation: 'warning',
    closed_won: 'success',
    closed_lost: 'danger',
  }

  const moveContact = (contactId: string, newStage: ContactStage) => {
    setContacts(contacts.map(c => 
      c.id === contactId ? { ...c, stage: newStage } : c
    ))
  }

  const openModal = (contact?: Contact) => {
    setSelectedContact(contact || {
      id: Date.now().toString(),
      name: '',
      company: '',
      email: '',
      stage: 'new',
      value: 0,
      lastContact: new Date().toISOString().split('T')[0],
    })
    setIsModalOpen(true)
  }

  const saveContact = () => {
    if (!selectedContact) return
    
    if (contacts.find(c => c.id === selectedContact.id)) {
      setContacts(contacts.map(c => c.id === selectedContact.id ? selectedContact : c))
    } else {
      setContacts([selectedContact, ...contacts])
    }
    
    setIsModalOpen(false)
    setSelectedContact(null)
  }

  const totalValue = contacts.reduce((sum, c) => sum + c.value, 0)
  const wonValue = contacts.filter(c => c.stage === 'closed_won').reduce((sum, c) => sum + c.value, 0)
  const pipelineValue = contacts.filter(c => !['closed_won', 'closed_lost'].includes(c.stage)).reduce((sum, c) => sum + c.value, 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Revenue Pipeline
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage your contacts and deals
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={view === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setView('list')}
            >
              List View
            </Button>
            <Button
              variant={view === 'kanban' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setView('kanban')}
            >
              Kanban View
            </Button>
            <Button onClick={() => openModal()} className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Add Contact
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400">Pipeline Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                ${pipelineValue.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400">Won This Month</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                ${wonValue.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400">Active Deals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {contacts.filter(c => !['closed_won', 'closed_lost'].includes(c.stage)).length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                35%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Follow-up Reminders */}
        {contacts.filter(c => c.nextFollowUp && new Date(c.nextFollowUp) <= new Date()).length > 0 && (
          <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <div>
                  <p className="text-sm font-medium text-yellow-900 dark:text-yellow-300">
                    Follow-up Reminders
                  </p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                    {contacts.filter(c => c.nextFollowUp && new Date(c.nextFollowUp) <= new Date()).length} contacts need follow-up
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Kanban View */}
        {view === 'kanban' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4">
            {stages.map((stage) => (
              <div key={stage} className="flex-shrink-0 w-full">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {stageLabels[stage]}
                      </h3>
                      <Badge variant={stageColors[stage]} className="text-xs">
                        {contacts.filter(c => c.stage === stage).length}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 min-h-[200px]">
                    {contacts.filter(c => c.stage === stage).map((contact) => (
                      <Card key={contact.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                {contact.name}
                              </h4>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {contact.company}
                              </p>
                            </div>
                            <Badge variant="primary" className="text-xs">
                              ${contact.value.toLocaleString()}
                            </Badge>
                          </div>
                          
                          {contact.nextFollowUp && new Date(contact.nextFollowUp) <= new Date() && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-yellow-600 dark:text-yellow-400">
                              <AlertCircle className="w-3 h-3" />
                              Follow-up due
                            </div>
                          )}
                          
                          <div className="mt-3 flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openModal(contact)}
                              className="text-xs"
                            >
                              View
                            </Button>
                            <Select
                              value={contact.stage}
                              onChange={(e) => moveContact(contact.id, e.target.value as ContactStage)}
                              className="text-xs"
                            >
                              {stages.map(s => (
                                <option key={s} value={s}>{stageLabels[s]}</option>
                              ))}
                            </Select>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}

        {/* Contact Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedContact(null)
          }}
          title={selectedContact?.id && contacts.find(c => c.id === selectedContact.id) ? 'Edit Contact' : 'Add Contact'}
        >
          {selectedContact && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name *
                  </label>
                  <Input
                    placeholder="Full name"
                    value={selectedContact.name}
                    onChange={(e) => setSelectedContact({ ...selectedContact, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company *
                  </label>
                  <Input
                    placeholder="Company name"
                    value={selectedContact.company}
                    onChange={(e) => setSelectedContact({ ...selectedContact, company: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email *
                  </label>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={selectedContact.email}
                    onChange={(e) => setSelectedContact({ ...selectedContact, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <Input
                    type="tel"
                    placeholder="+1 555-0100"
                    value={selectedContact.phone || ''}
                    onChange={(e) => setSelectedContact({ ...selectedContact, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Stage
                  </label>
                  <Select
                    value={selectedContact.stage}
                    onChange={(e) => setSelectedContact({ ...selectedContact, stage: e.target.value as ContactStage })}
                  >
                    {stages.map(stage => (
                      <option key={stage} value={stage}>{stageLabels[stage]}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Deal Value ($)
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={selectedContact.value}
                    onChange={(e) => setSelectedContact({ ...selectedContact, value: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Contact
                  </label>
                  <Input
                    type="date"
                    value={selectedContact.lastContact}
                    onChange={(e) => setSelectedContact({ ...selectedContact, lastContact: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Next Follow-up
                  </label>
                  <Input
                    type="date"
                    value={selectedContact.nextFollowUp || ''}
                    onChange={(e) => setSelectedContact({ ...selectedContact, nextFollowUp: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <Textarea
                  placeholder="Add notes about this contact..."
                  value={selectedContact.notes || ''}
                  onChange={(e) => setSelectedContact({ ...selectedContact, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={saveContact}
                  disabled={!selectedContact.name.trim() || !selectedContact.company.trim() || !selectedContact.email.trim()}
                >
                  Save Contact
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  )
}