from rest_framework import serializers
from resources.models import ContentPartner, Grade, Subject, FileTypes, Resource, ResourceBanner
import time

class ContentPartnerSerializer(serializers.ModelSerializer):

    course_count = serializers.SerializerMethodField()

    class Meta:
        model = ContentPartner
        fields = ('id', 'name', 'icon', 'slug', 'course_count')

    def get_course_count(self, obj):
        return obj.content_partner_obj.count()

class GradeSerializer(serializers.ModelSerializer):

    course_count = serializers.SerializerMethodField()

    class Meta:
        model = Grade
        fields = ('id', 'name', 'slug', 'course_count')

    def get_course_count(self, obj):
        return obj.grade_obj.count()


class SubjectSerializer(serializers.ModelSerializer):

    course_count = serializers.SerializerMethodField()

    class Meta:
        model = Subject
        fields = ('id', 'name', 'slug', 'course_count')

    def get_course_count(self, obj):
        return obj.subject_obj.count()

class FileTypesSerializer(serializers.ModelSerializer):

    course_count = serializers.SerializerMethodField()

    class Meta:
        model = FileTypes
        fields = ('id', 'name', 'icon', 'course_count')

    def get_course_count(self, obj):
        return obj.file_type_obj.count()

class GradeDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Grade
        fields = ('id', 'name')

class ResourceSerializer(serializers.ModelSerializer):

    file_type_name = serializers.CharField(source="file_type.name")
    subject_name = serializers.CharField(source="subject.name")
    content_partner_name = serializers.CharField(source="content_partner.name")
    ts = serializers.SerializerMethodField()
    grade = GradeDetailsSerializer(many=True, required=False)

    class Meta:
        model = Resource
        fields = ('id', 'name', 'file', 'link', 'file_type', 'grade', 
            'subject', 'content_partner', 'created_by', 'file_type_name',
            'subject_name', 'content_partner_name', 'description', 'source_url', 'ts', 'placeholder_image'
            )

    def get_ts(self, obj):
        return int(time.time())


class ResourceBannerSerializer(serializers.ModelSerializer):

    image = serializers.ImageField(
            max_length = None,
        )
    class Meta:
        model = ResourceBanner
        fields = ('image', 'redirect_url', 'order')