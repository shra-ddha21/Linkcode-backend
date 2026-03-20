import Course from "../models/Course.Model.js";
import { v2 as cloudinary } from "cloudinary";


export const createCourse = async (req, res) => {
    const adminId = req.adminId;
    const { title, description, price } = req.body;

    try {
        if (!title || !description || !price) {
            return res.status(400).json({ errors: "All fields are required" });
        }

        if (!req.files || !req.files.video) {
            return res.status(400).json({ errors: "No video uploaded" });
        }

        const video = req.files.video;

        const allowedFormat = ["video/mp4"];

        if (!allowedFormat.includes(video.mimetype)) {
            return res.status(400).json({ errors: "Invalid video format. Only MP4 allowed" });
        }

        const cloud_response = await cloudinary.uploader.upload(
            video.tempFilePath,
            {
                resource_type: "video",
                folder: "lms/videos"
            }

        );

        if (!cloud_response || cloud_response.error) {
            return res.status(400).json({ errors: "Error uploading video to cloudinary" });
        }

        const courseData = {
            title,
            description,
            price,
            video: {
                public_id: cloud_response.public_id,
                url: cloud_response.secure_url
            },
            creatorId: adminId
        };

        const course = await Course.create(courseData);

        res.json({
            message: "Course created successfully",
            course,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error while creating course" });
    }
};

export const updateCourse = async (req, res) => {
    const adminId = req.adminId;
    const { courseId } = req.params;
    const { title, description, price } = req.body;

    try {
        const courseSearch = await Course.findById(courseId);

        if (!courseSearch) {
            return res.status(404).json({ errors: "Course not found" });
        }

        const updateData = {
            title,
            description,
            price
        };

        // If new video is uploaded
        if (req.files && req.files.video) {

            const video = req.files.video;

            const allowedFormat = ["video/mp4"];
            if (!allowedFormat.includes(video.mimetype)) {
                return res.status(400).json({
                    errors: "Invalid video format. Only MP4 allowed"
                });
            }

            // Delete old video from Cloudinary (BEST PRACTICE)
            if (courseSearch.video && courseSearch.video.public_id) {
                await cloudinary.uploader.destroy(
                    courseSearch.video.public_id,
                    { resource_type: "video" }
                );
            }

            // Upload new video
            const cloud_response = await cloudinary.uploader.upload(
                video.tempFilePath,
                {
                    resource_type: "video",
                    folder: "lms/videos"
                }
            );

            if (!cloud_response || cloud_response.error) {
                return res.status(400).json({
                    errors: "Error uploading video to cloudinary"
                });
            }

            updateData.video = {
                public_id: cloud_response.public_id,
                url: cloud_response.secure_url
            };
        }

        const course = await Course.findByIdAndUpdate(
            courseId,
            updateData,
            { new: true }
        );

        res.status(200).json({
            message: "Course updated successfully",
            course
        });

    } catch (error) {
        console.log("Error in course updating", error);
        res.status(500).json({
            error: "Error in course updating"
        });
    }
};

export const deleteCourse = async (req, res) => {
    const adminId = req.adminId;
    const { courseId } = req.params;

    try {
        //  Find course first
        const course = await Course.findOne({
            _id: courseId,
            creatorId: adminId,
        });

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        //  Delete video from Cloudinary
        if (course.video && course.video.public_id) {
            await cloudinary.uploader.destroy(
                course.video.public_id,
                { resource_type: "video" }
            );
        }

        // Delete course from DB
        await Course.findByIdAndDelete(courseId);

        res.status(200).json({
            message: "Course deleted successfully"
        });

    } catch (error) {
        console.log("Error in course deleting", error);
        res.status(500).json({
            error: "Error in course deleting"
        });
    }
};


export const getCourses = async (req, res) => {

    try {
        const courses = await Course.find({})
        res.status(200).json({ courses })

    } catch (error) {
        res.status(500).json({ error: "Error in getting courses" });
        console.log("Error to get courses", error);


    }

};

export const courseDetails = async (req, res) => {
    const { courseId } = req.params;
    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(400).json({ error: "Course not found" })
        }
        res.status(200).json({ course });


    } catch (error) {
        res.status(500).json({ errors: "Error in getting course details" })
        console.log("Error in course details", error);

    }

};