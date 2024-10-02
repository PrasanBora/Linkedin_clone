import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
	{
		// the recipient field will store an ObjectId  
		// and that ObjectId specifically corresponds to a document in the User collection

		recipient: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		type: {
			type: String,
			required: true,
			enum: ["like", "comment", "connectionAccepted"],
		},
		// field can only accept values that are listed in the enum

		relatedUser: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		relatedPost: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
		},
		read: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true } // to take time stamps on every notification
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
