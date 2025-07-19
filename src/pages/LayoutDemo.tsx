/**
 * Layout Components Demo
 *
 * Demonstration page for layout and navigation components.
 */

import { useState } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useModal,
  useToast,
} from '../components/ui';

export default function LayoutDemo() {
  const [modalOpen, setModalOpen] = useState(false);
  const modal = useModal();
  const toast = useToast();

  const handleConfirmAction = async () => {
    const confirmed = await modal.confirm({
      title: 'Delete Item',
      content: 'Are you sure you want to delete this item? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });

    if (confirmed) {
      toast.success({
        title: 'Success',
        description: 'Item deleted successfully',
      });
    }
  };

  const handleShowAlert = () => {
    modal.alert({
      title: 'Information',
      content: 'This is an informational message.',
      buttonText: 'Got it',
    });
  };

  const showToasts = () => {
    toast.success({ title: 'Success!', description: 'Operation completed successfully' });
    setTimeout(() => {
      toast.error({ title: 'Error', description: 'Something went wrong' });
    }, 1000);
    setTimeout(() => {
      toast.warning({ title: 'Warning', description: 'Please check your settings' });
    }, 2000);
    setTimeout(() => {
      toast.info({ title: 'Info', description: 'New feature available' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="mx-auto max-w-6xl space-y-8 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text-primary">Layout & Navigation Components</h1>
          <p className="mt-2 text-text-secondary">
            Demonstration of cards, modals, toasts, tabs, and accordions
          </p>
        </div>

        {/* Cards Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-text-primary">Cards</h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Basic Card */}
            <Card>
              <CardHeader title="Basic Card" subtitle="Simple card with header and body" />
              <CardBody>
                <p className="text-sm">
                  This is a basic card with a header, body, and footer. Cards are flexible content
                  containers.
                </p>
              </CardBody>
              <CardFooter>
                <Button size="sm">Action</Button>
                <Badge variant="success">Active</Badge>
              </CardFooter>
            </Card>

            {/* Interactive Card */}
            <Card interactive variant="elevated">
              <CardHeader
                title="Interactive Card"
                subtitle="Click me!"
                action={
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                }
              />
              <CardBody>
                <p className="text-sm">
                  This card is interactive and will respond to hover and click events.
                </p>
              </CardBody>
            </Card>

            {/* Outlined Card */}
            <Card variant="outlined">
              <CardHeader title="Outlined Card" />
              <CardBody>
                <div className="space-y-3">
                  <Input placeholder="Enter your name" size="sm" />
                  <Input placeholder="Enter your email" size="sm" />
                </div>
              </CardBody>
              <CardFooter>
                <Button size="sm" variant="outline">
                  Cancel
                </Button>
                <Button size="sm">Submit</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Modals Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-text-primary">Modals & Dialogs</h2>

          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => {
                setModalOpen(true);
              }}
            >
              Basic Modal
            </Button>
            <Button onClick={handleConfirmAction} variant="destructive">
              Confirm Dialog
            </Button>
            <Button onClick={handleShowAlert} variant="outline">
              Alert Dialog
            </Button>
          </div>

          {/* Basic Modal */}
          <Modal open={modalOpen} onOpenChange={setModalOpen} title="Basic Modal" size="md">
            <ModalBody>
              <div className="space-y-4">
                <p>
                  This is a basic modal dialog. You can close it by clicking the X button, pressing
                  Escape, or clicking outside the modal.
                </p>
                <Input placeholder="Enter some text..." />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setModalOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setModalOpen(false);
                }}
              >
                Save
              </Button>
            </ModalFooter>
          </Modal>
        </section>

        {/* Toasts Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-text-primary">Toast Notifications</h2>

          <div className="flex flex-wrap gap-4">
            <Button onClick={showToasts}>Show All Toasts</Button>
            <Button
              onClick={() => toast.success({ title: 'Success', description: 'Task completed' })}
              variant="success"
            >
              Success Toast
            </Button>
            <Button
              onClick={() => toast.error({ title: 'Error', description: 'Something went wrong' })}
              variant="destructive"
            >
              Error Toast
            </Button>
            <Button
              onClick={() => toast.warning({ title: 'Warning', description: 'Please review' })}
              variant="warning"
            >
              Warning Toast
            </Button>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-text-primary">Tabs</h2>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Default Tabs */}
            <Card>
              <CardHeader title="Default Tabs" />
              <CardBody>
                <Tabs defaultValue="tab1" variant="default">
                  <TabsList>
                    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                    <TabsTrigger value="tab3">Tab 3</TabsTrigger>
                  </TabsList>
                  <TabsContent value="tab1">
                    <p className="text-sm">
                      Content for Tab 1. This tab contains information about the first topic.
                    </p>
                  </TabsContent>
                  <TabsContent value="tab2">
                    <p className="text-sm">
                      Content for Tab 2. This tab shows different information.
                    </p>
                  </TabsContent>
                  <TabsContent value="tab3">
                    <p className="text-sm">Content for Tab 3. The final tab with more details.</p>
                  </TabsContent>
                </Tabs>
              </CardBody>
            </Card>

            {/* Pills Tabs */}
            <Card>
              <CardHeader title="Pills Tabs" />
              <CardBody>
                <Tabs defaultValue="settings" variant="pills">
                  <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                    <TabsTrigger value="billing">Billing</TabsTrigger>
                  </TabsList>
                  <TabsContent value="profile">
                    <div className="space-y-3">
                      <Input placeholder="Full name" size="sm" />
                      <Input placeholder="Email address" size="sm" />
                    </div>
                  </TabsContent>
                  <TabsContent value="settings">
                    <div className="space-y-3">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Enable notifications</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Dark mode</span>
                      </label>
                    </div>
                  </TabsContent>
                  <TabsContent value="billing">
                    <p className="text-sm">Billing information and payment methods.</p>
                  </TabsContent>
                </Tabs>
              </CardBody>
            </Card>
          </div>
        </section>

        {/* Accordion Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-text-primary">Accordions</h2>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Single Accordion */}
            <Card>
              <CardHeader title="Single Accordion" subtitle="Only one item can be open" />
              <CardBody>
                <Accordion type="single" collapsible defaultValue="item-1">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>What is React?</AccordionTrigger>
                    <AccordionContent>
                      React is a JavaScript library for building user interfaces, particularly web
                      applications. It allows developers to create reusable UI components.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>What is TypeScript?</AccordionTrigger>
                    <AccordionContent>
                      TypeScript is a programming language developed by Microsoft. It is a strict
                      syntactical superset of JavaScript and adds optional static type checking.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>What is Tailwind CSS?</AccordionTrigger>
                    <AccordionContent>
                      Tailwind CSS is a utility-first CSS framework for rapidly building custom user
                      interfaces. It provides low-level utility classes that let you build
                      completely custom designs.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardBody>
            </Card>

            {/* Multiple Accordion */}
            <Card>
              <CardHeader title="Multiple Accordion" subtitle="Multiple items can be open" />
              <CardBody>
                <Accordion type="multiple" variant="separated" defaultValue={['faq-1', 'faq-2']}>
                  <AccordionItem value="faq-1">
                    <AccordionTrigger>How do I get started?</AccordionTrigger>
                    <AccordionContent>
                      Getting started is easy! Simply sign up for an account and follow our
                      onboarding guide. We'll walk you through the basics and help you set up your
                      first project.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-2">
                    <AccordionTrigger>Is there a free trial?</AccordionTrigger>
                    <AccordionContent>
                      Yes! We offer a 14-day free trial with full access to all features. No credit
                      card required to get started.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-3">
                    <AccordionTrigger>Can I cancel anytime?</AccordionTrigger>
                    <AccordionContent>
                      Absolutely. You can cancel your subscription at any time from your account
                      settings. Your access will continue until the end of your current billing
                      period.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardBody>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
