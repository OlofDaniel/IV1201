import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React from "react";

interface newUsernameDialogProps {
    onAddNewUsername: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function NewUsernameDialog({onAddNewUsername}: newUsernameDialogProps) {
    return (
        <Dialog>
                <DialogTrigger asChild>
                    <Button className="underline p-0 h-fit w-fit" variant="link">Add username</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                    <form onSubmit={onAddNewUsername}>
                    <DialogHeader>
                        <DialogTitle>Add a new username</DialogTitle>
                        <DialogDescription>Please enter your new username below and click save</DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                        <Field className="py-5">
                            <Label htmlFor="username-1">New Username</Label>
                            <Input id="username-1" name="username" defaultValue="" />
                        </Field>
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save username</Button>
                    </DialogFooter>
                    </form>
                </DialogContent>
        </Dialog>
    )
}
