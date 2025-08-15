import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@components/ui/dialog";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import { Calendar, Plus, X } from "lucide-react";

export function ScheduleAppointmentDialog({ open, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        participants: [{ name: "", email: "" }],
        date: "",
        duration: ""
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleParticipantChange = (index, field, value) => {
        const updatedParticipants = [...formData.participants];
        updatedParticipants[index][field] = value;
        setFormData(prev => ({ ...prev, participants: updatedParticipants }));
    };

    const addParticipant = () => {
        setFormData(prev => ({
            ...prev,
            participants: [...prev.participants, { name: "", email: "" }]
        }));
    };

    const removeParticipant = (index) => {
        if (formData.participants.length > 1) {
            const updatedParticipants = formData.participants.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, participants: updatedParticipants }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Convert date string to ISO format and get timezone
        const selectedDate = new Date(formData.date);
        const isoDate = selectedDate.toISOString();
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        const appointmentData = {
            title: formData.title,
            description: formData.description,
            participants: formData.participants.filter(p => p.name.trim() && p.email.trim()),
            date: isoDate,
            duration: parseInt(formData.duration),
            timezone: timezone
        };

        console.log(appointmentData);

        onSubmit(appointmentData);
        
        // Reset form
        setFormData({
            title: "",
            description: "",
            participants: [{ name: "", email: "" }],
            date: "",
            duration: ""
        });
        
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Schedule New Appointment</DialogTitle>
                    <DialogDescription>
                        Create a new appointment with participants.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            placeholder="Enter appointment title"
                            value={formData.title}
                            onChange={(e) => handleInputChange("title", e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Enter appointment description"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="date">Date & Time</Label>
                            <Input
                                id="date"
                                type="datetime-local"
                                value={formData.date}
                                onChange={(e) => handleInputChange("date", e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="duration">Duration (minutes)</Label>
                            <Input
                                id="duration"
                                type="number"
                                placeholder="30"
                                value={formData.duration}
                                onChange={(e) => handleInputChange("duration", e.target.value)}
                                required
                                min="1"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <Label>Participants</Label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addParticipant}
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Add Participant
                            </Button>
                        </div>
                        
                        <div className="space-y-3">
                            {formData.participants.map((participant, index) => (
                                <div key={index} className="flex gap-2 items-end">
                                    <div className="flex-1">
                                        <Label className="text-xs">Name</Label>
                                        <Input
                                            placeholder="Participant name"
                                            value={participant.name}
                                            onChange={(e) => handleParticipantChange(index, "name", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <Label className="text-xs">Email</Label>
                                        <Input
                                            type="email"
                                            placeholder="participant@email.com"
                                            value={participant.email}
                                            onChange={(e) => handleParticipantChange(index, "email", e.target.value)}
                                            required
                                        />
                                    </div>
                                    {formData.participants.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeParticipant(index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule Appointment
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
