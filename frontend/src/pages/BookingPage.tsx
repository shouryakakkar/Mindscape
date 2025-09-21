import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Shield, 
  CheckCircle,
  MapPin,
  Phone,
  Video,
  MessageSquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth, API_BASE } from "@/lib/api";

const counselors = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    specialty: 'Anxiety & Depression',
    experience: '8 years',
    rating: 4.9,
    avatar: '👩‍⚕️',
    available: ['Mon', 'Wed', 'Fri']
  },
  {
    id: '2',
    name: 'Dr. Michael Torres',
    specialty: 'Academic Stress & ADHD',
    experience: '6 years',
    rating: 4.8,
    avatar: '👨‍⚕️',
    available: ['Tue', 'Thu', 'Sat']
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Relationship & Social Anxiety',
    experience: '10 years',
    rating: 5.0,
    avatar: '👩‍🔬',
    available: ['Mon', 'Tue', 'Thu']
  }
];

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', 
  '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

const sessionTypes = [
  { id: 'in-person', name: 'In-Person', icon: MapPin, description: 'Visit our campus wellness center' },
  { id: 'video', name: 'Video Call', icon: Video, description: 'Secure online session' },
  { id: 'phone', name: 'Phone Call', icon: Phone, description: 'Audio-only session' },
  { id: 'chat', name: 'Text Chat', icon: MessageSquare, description: 'Secure messaging session' }
];

export default function BookingPage() {
  const [selectedCounselor, setSelectedCounselor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('video');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    concern: '',
    urgency: 'normal'
  });

  const navigate = useNavigate();

  const handleBooking = async () => {
    if (!selectedCounselor || !selectedDate || !selectedTime) {
      alert('Please select counselor, date and time.');
      return;
    }

    try {
      const res = await fetchWithAuth(`${API_BASE}/api/booking/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotId: `${selectedCounselor}-${selectedDate}-${selectedTime}`,
          type: 'consultation',
          notes: `${selectedType}; anonymous=${isAnonymous}; concern=${formData.concern}; urgency=${formData.urgency}; name=${formData.name}; email=${formData.email}`
        })
      });

      if (res.status === 401) {
        alert('Session expired. Please sign in again.');
        navigate('/auth');
        return;
      }

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || `Failed to book (${res.status})`);
      }

      const payload = {
        counselorId: selectedCounselor,
        counselorName: counselors.find(c => c.id === selectedCounselor)?.name,
        date: selectedDate,
        time: selectedTime,
        type: selectedType,
        anonymous: isAnonymous,
        ...formData,
        appointmentId: data?.data?.id || undefined,
      };

      navigate('/booking/success', { state: payload });
    } catch (err: any) {
      alert(err?.message || 'Failed to book appointment.');
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 gradient-text">Book Your Session</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Schedule a confidential appointment with our licensed mental health professionals
          </p>
          
          <div className="flex flex-wrap gap-2 justify-center mt-6">
            <Badge variant="secondary" className="glass">
              <Shield className="w-3 h-3 mr-1" />
              HIPAA Compliant
            </Badge>
            <Badge variant="secondary" className="glass">
              <CheckCircle className="w-3 h-3 mr-1" />
              Licensed Professionals
            </Badge>
            <Badge variant="secondary" className="glass">
              <CalendarIcon className="w-3 h-3 mr-1" />
              Same Day Available
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Session Type */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Video className="w-5 h-5 mr-2 text-primary" />
                  Session Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sessionTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover-glass ${
                        selectedType === type.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border/30'
                      }`}
                      onClick={() => setSelectedType(type.id)}
                    >
                      <div className="flex items-center mb-2">
                        <type.icon className="w-5 h-5 mr-2 text-primary" />
                        <span className="font-semibold">{type.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Counselor Selection */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-primary" />
                  Select Counselor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {counselors.map((counselor) => (
                    <div
                      key={counselor.id}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover-glass ${
                        selectedCounselor === counselor.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border/30'
                      }`}
                      onClick={() => setSelectedCounselor(counselor.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-3xl mr-3">{counselor.avatar}</span>
                          <div>
                            <h3 className="font-semibold">{counselor.name}</h3>
                            <p className="text-sm text-muted-foreground">{counselor.specialty}</p>
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-muted-foreground mr-3">
                                {counselor.experience} experience
                              </span>
                              <Badge variant="outline" className="text-xs">
                                ⭐ {counselor.rating}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground mb-1">Available:</p>
                          <div className="flex gap-1">
                            {counselor.available.map(day => (
                              <span key={day} className="text-xs bg-secondary px-2 py-1 rounded">
                                {day}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Date & Time */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-primary" />
                  Date & Time
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="glass"
                  min={new Date().toISOString().split('T')[0]}
                />
                
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                      className="glass hover-glass"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-primary" />
                    Your Information
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAnonymous(!isAnonymous)}
                    className={`glass ${isAnonymous ? 'bg-primary/10' : ''}`}
                  >
                    {isAnonymous ? 'Anonymous Mode' : 'Use Full Name'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isAnonymous && (
                  <>
                    <Input
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="glass"
                    />
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="glass"
                    />
                  </>
                )}
                
                <Textarea
                  placeholder="Brief description of your concern (optional)"
                  value={formData.concern}
                  onChange={(e) => setFormData({...formData, concern: e.target.value})}
                  className="glass min-h-20"
                />

                <div>
                  <label className="text-sm font-medium mb-2 block">Urgency Level</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                    className="w-full p-3 rounded-xl glass border border-border/30"
                  >
                    <option value="normal">Normal - Within a week</option>
                    <option value="urgent">Urgent - Within 24-48 hours</option>
                    <option value="crisis">Crisis - Immediate attention needed</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedCounselor && (
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      {counselors.find(c => c.id === selectedCounselor)?.name}
                    </span>
                  </div>
                )}
                
                {selectedDate && (
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{new Date(selectedDate).toLocaleDateString()}</span>
                  </div>
                )}
                
                {selectedTime && (
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{selectedTime}</span>
                  </div>
                )}
                
                {selectedType && (
                  <div className="flex items-center">
                    {(() => {
                      const selectedSessionType = sessionTypes.find(t => t.id === selectedType);
                      const IconComponent = selectedSessionType?.icon;
                      return IconComponent ? (
                        <IconComponent className="w-4 h-4 mr-2 text-muted-foreground" />
                      ) : null;
                    })()}
                    <span className="text-sm">
                      {sessionTypes.find(t => t.id === selectedType)?.name}
                    </span>
                  </div>
                )}

                <div className="pt-4 border-t border-border/30">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Cost:</span>
                    <span className="text-success">Free for Students</span>
                  </div>
                </div>

                <Button 
                  className="w-full rounded-xl hover-glass"
                  onClick={handleBooking}
                  disabled={!selectedCounselor || !selectedDate || !selectedTime}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Booking
                </Button>
              </CardContent>
            </Card>

            {/* Crisis Support */}
            <Card className="glass-card border-destructive/20">
              <CardHeader>
                <CardTitle className="text-destructive">Need Immediate Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  If you're having thoughts of self-harm or suicide, please reach out immediately:
                </p>
                <div className="space-y-2 text-sm">
                  <div>🇮🇳 iCall: <strong>14416</strong></div>
                  <div>🇮🇳 Samaritans: <strong>91529 87821</strong></div>
                </div>
                <Button variant="destructive" size="sm" className="w-full mt-4">
                  <Phone className="w-4 h-4 mr-2" />
                  Emergency Services: 112
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}